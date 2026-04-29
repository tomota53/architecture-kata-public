"use server";

import { supabase } from "@/lib/supabase";

// ─── お題 ───

export async function getKataProblems() {
  try {
    const { data, error } = await supabase
      .from("kata_problems")
      .select("id, title, description, difficulty")
      .eq("is_preset", true);

    if (error) return [];

    const order: Record<string, number> = { easy: 0, medium: 1, hard: 2 };
    return [...(data ?? [])].sort(
      (a, b) => (order[a.difficulty] ?? 9) - (order[b.difficulty] ?? 9)
    );
  } catch {
    return [];
  }
}

export async function getKataProblemById(problemId: string) {
  try {
    const { data, error } = await supabase
      .from("kata_problems")
      .select("id, title, description, difficulty")
      .eq("id", problemId)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

// ─── レポート提出 ───

export async function submitReport(data: {
  kataProblemId: string;
  userName: string;
  shareCode: string | null;
  requirements: { id: string; question: string; answer: string }[];
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
}): Promise<{ id?: string; error?: string }> {
  try {
    if (!data.userName.trim()) {
      return { error: "名前を入力してください" };
    }
    if (!data.kataProblemId) {
      return { error: "お題が選択されていません" };
    }

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        kata_problem_id: data.kataProblemId,
        user_name: data.userName.trim(),
        share_code: data.shareCode?.trim() || null,
        requirements: data.requirements,
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
      })
      .select("id")
      .single();

    if (error) {
      console.error("submitReport DB error:", error);
      return { error: `レポートの保存に失敗しました: ${error.message}` };
    }

    return { id: report.id };
  } catch (e) {
    console.error("submitReport unexpected error:", e);
    return { error: "予期しないエラーが発生しました。もう一度お試しください。" };
  }
}

// ─── レポート取得 ───

export async function getReportById(id: string) {
  try {
    const { data: report, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !report) return null;

    const { data: problem } = await supabase
      .from("kata_problems")
      .select("id, title, description, difficulty")
      .eq("id", report.kata_problem_id)
      .single();

    return { report, problem };
  } catch {
    return null;
  }
}

export async function getReportsByShareCode(code: string) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("id, user_name, kata_problem_id, created_at")
      .eq("share_code", code.trim())
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

    // お題名を取得
    const problemIds = [...new Set(data.map((r) => r.kata_problem_id))];
    const { data: problems } = await supabase
      .from("kata_problems")
      .select("id, title")
      .in("id", problemIds);

    const problemMap = new Map((problems ?? []).map((p) => [p.id, p.title]));

    return data.map((r) => ({
      id: r.id,
      userName: r.user_name,
      problemTitle: problemMap.get(r.kata_problem_id) ?? "不明なお題",
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}
