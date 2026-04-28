"use server";

import { supabase } from "@/lib/supabase";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 紛らわしい文字を除外
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createSession(formData: FormData) {
  const title = formData.get("title") as string;
  const kataProblemId = formData.get("kataProblemId") as string;
  const groupCount = parseInt(formData.get("groupCount") as string, 10);

  if (!title || !kataProblemId || !groupCount) {
    return { error: "すべての項目を入力してください" };
  }

  // 参加コード生成（重複回避のためリトライ）
  let joinCode = "";
  for (let i = 0; i < 5; i++) {
    joinCode = generateJoinCode();
    const { data: existing } = await supabase
      .from("sessions")
      .select("id")
      .eq("join_code", joinCode)
      .single();
    if (!existing) break;
  }

  // セッション作成
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      title,
      join_code: joinCode,
      kata_problem_id: kataProblemId,
    })
    .select()
    .single();

  if (sessionError || !session) {
    return { error: "セッションの作成に失敗しました" };
  }

  // グループ作成
  const groups = Array.from({ length: groupCount }, (_, i) => ({
    session_id: session.id,
    name: `チーム${String.fromCharCode(65 + i)}`, // チームA, B, C...
  }));

  const { error: groupError } = await supabase.from("groups").insert(groups);

  if (groupError) {
    return { error: "グループの作成に失敗しました" };
  }

  return { sessionId: session.id };
}

export async function getKataProblems() {
  const { data, error } = await supabase
    .from("kata_problems")
    .select("id, title, description, difficulty")
    .eq("is_preset", true);

  if (error) return [];

  const order: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
  return [...(data ?? [])].sort(
    (a, b) => (order[a.difficulty] ?? 9) - (order[b.difficulty] ?? 9)
  );
}

export async function getSessionByJoinCode(joinCode: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, title, join_code, status, kata_problem_id")
    .eq("join_code", joinCode.toUpperCase())
    .eq("status", "active")
    .single();

  if (error || !data) return null;
  return data;
}

export async function getGroupsBySessionId(sessionId: string) {
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, member_names")
    .eq("session_id", sessionId)
    .order("name");

  if (error) return [];
  return data;
}

export async function getSessionDetail(sessionId: string) {
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, title, join_code, status, kata_problem_id, created_at")
    .eq("id", sessionId)
    .single();

  if (error || !session) return null;

  const { data: problem } = await supabase
    .from("kata_problems")
    .select("id, title, description, difficulty, hints")
    .eq("id", session.kata_problem_id)
    .single();

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, member_names")
    .eq("session_id", sessionId)
    .order("name");

  // 各グループの提出状況を取得（コンポーネント情報含む）
  const { data: selections } = await supabase
    .from("selections")
    .select("group_id, choice_1, choice_2, choice_3, component_ids, component_reason, requirements")
    .eq("session_id", sessionId);

  const selectionByGroup = new Map(
    (selections ?? []).map((s) => [s.group_id, s])
  );

  const groupsWithStatus = (groups ?? []).map((g) => {
    const sel = selectionByGroup.get(g.id);
    return {
      ...g,
      submitted: !!sel,
      choices: sel ? [sel.choice_1, sel.choice_2, sel.choice_3].filter(Boolean) : [],
      componentIds: (sel?.component_ids as string[] | null) ?? [],
      requirements: (sel?.requirements as { id: string; question: string; answer: string }[] | null) ?? [],
    };
  });

  return { session, problem, groups: groupsWithStatus };
}

export async function getKataProblemById(problemId: string) {
  const { data, error } = await supabase
    .from("kata_problems")
    .select("id, title, description, difficulty")
    .eq("id", problemId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function updateMemberNames(groupId: string, memberNames: string[]) {
  const { error } = await supabase
    .from("groups")
    .update({ member_names: memberNames })
    .eq("id", groupId);

  if (error) return { error: "メンバー名の保存に失敗しました" };
  return { success: true };
}

export async function submitSelections(data: {
  groupId: string;
  sessionId: string;
  choice1: string;
  choice1Reason: string;
  choice2: string;
  choice2Reason: string;
  choice3: string;
  choice3Reason: string;
  tradeoff1: string;
  tradeoff1Reason: string;
  tradeoff2: string;
  tradeoff2Reason: string;
  discussionMemo: string;
  componentIds: string[];
  componentReason: string;
  requirements: { id: string; question: string; answer: string }[];
}) {
  const { error } = await supabase.from("selections").insert({
    group_id: data.groupId,
    session_id: data.sessionId,
    choice_1: data.choice1,
    choice_1_reason: data.choice1Reason,
    choice_2: data.choice2,
    choice_2_reason: data.choice2Reason,
    choice_3: data.choice3,
    choice_3_reason: data.choice3Reason,
    tradeoff_1: data.tradeoff1 || null,
    tradeoff_1_reason: data.tradeoff1Reason || null,
    tradeoff_2: data.tradeoff2 || null,
    tradeoff_2_reason: data.tradeoff2Reason || null,
    discussion_memo: data.discussionMemo || null,
    component_ids: data.componentIds.length > 0 ? data.componentIds : null,
    component_reason: data.componentReason || null,
    requirements: data.requirements,
  });

  if (error) return { error: `提出に失敗しました: ${error.message}` };
  return { success: true };
}

export async function getGroupById(groupId: string) {
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, member_names, session_id")
    .eq("id", groupId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSelectionByGroupId(groupId: string) {
  const { data, error } = await supabase
    .from("selections")
    .select("*")
    .eq("group_id", groupId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getSummaryData(joinCode: string, groupId: string) {
  const session = await getSessionByJoinCode(joinCode);
  if (!session) return null;

  const [group, selection] = await Promise.all([
    getGroupById(groupId),
    getSelectionByGroupId(groupId),
  ]);

  if (!group || !selection) return null;

  const problem = await getKataProblemById(session.kata_problem_id);

  return { session, group, selection, problem };
}

export async function finishSession(sessionId: string) {
  const { error } = await supabase
    .from("sessions")
    .update({ status: "finished" })
    .eq("id", sessionId);

  if (error) return { error: "セッションの終了に失敗しました" };
  return { success: true };
}
