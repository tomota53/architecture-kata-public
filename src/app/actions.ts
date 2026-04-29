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

// ─── 共有コード生成 ───

export async function generateShareCode(): Promise<{ code?: string; error?: string }> {
  try {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for (let attempt = 0; attempt < 5; attempt++) {
      let code = "";
      for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      const formatted = `${code.slice(0, 4)}-${code.slice(4)}`;

      const { count } = await supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("share_code", formatted);

      if (count === 0) return { code: formatted };
    }
    return { error: "共有コードの生成に失敗しました。もう一度お試しください。" };
  } catch {
    return { error: "共有コードの生成に失敗しました。" };
  }
}

// ─── 下書き保存・更新 ───

export async function saveDraft(data: {
  reportId?: string;
  kataProblemId: string;
  userName: string;
  shareCode: string | null;
  step: number;
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

    const row = {
      kata_problem_id: data.kataProblemId,
      user_name: data.userName.trim(),
      share_code: data.shareCode?.trim() || null,
      requirements: data.requirements,
      choice_1: data.choice1 || null,
      choice_1_reason: data.choice1Reason || null,
      choice_2: data.choice2 || null,
      choice_2_reason: data.choice2Reason || null,
      choice_3: data.choice3 || null,
      choice_3_reason: data.choice3Reason || null,
      tradeoff_1: data.tradeoff1 || null,
      tradeoff_1_reason: data.tradeoff1Reason || null,
      tradeoff_2: data.tradeoff2 || null,
      tradeoff_2_reason: data.tradeoff2Reason || null,
      discussion_memo: data.discussionMemo || null,
      component_ids: data.componentIds.length > 0 ? data.componentIds : null,
      component_reason: data.componentReason || null,
      status: "draft",
    };

    if (data.reportId) {
      // 既存の下書きを更新
      const { error } = await supabase
        .from("reports")
        .update(row)
        .eq("id", data.reportId)
        .eq("status", "draft");

      if (error) {
        console.error("saveDraft update error:", error);
        return { error: `保存に失敗しました: ${error.message}` };
      }
      return { id: data.reportId };
    } else {
      // 新規下書き作成
      const { data: report, error } = await supabase
        .from("reports")
        .insert(row)
        .select("id")
        .single();

      if (error) {
        console.error("saveDraft insert error:", error);
        return { error: `保存に失敗しました: ${error.message}` };
      }
      return { id: report.id };
    }
  } catch (e) {
    console.error("saveDraft unexpected error:", e);
    return { error: "保存中にエラーが発生しました。" };
  }
}

// ─── レポート提出(下書き → 提出済み) ───

export async function submitReport(reportId: string): Promise<{ error?: string }> {
  try {
    if (!reportId) return { error: "レポートIDが指定されていません" };

    const { error } = await supabase
      .from("reports")
      .update({ status: "submitted" })
      .eq("id", reportId)
      .eq("status", "draft");

    if (error) {
      console.error("submitReport error:", error);
      return { error: `提出に失敗しました: ${error.message}` };
    }
    return {};
  } catch (e) {
    console.error("submitReport unexpected error:", e);
    return { error: "提出中にエラーが発生しました。もう一度お試しください。" };
  }
}

// ─── 下書き取得(再開用) ───

export async function getDraftById(id: string) {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("status", "draft")
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
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
      .eq("status", "submitted")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];

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
