declare namespace API {
  // 用户相关接口
  interface CurrentUser {
    id: number;
    username: string;
    name: string;
    role: 'admin' | 'player' | 'judge';
    email?: string;
    phone?: string;
  }

  // 比赛相关接口
  interface Competition {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'draft' | 'published' | 'in_progress' | 'completed';
    created_at?: string;
    updated_at?: string;
  }

  // 比赛阶段
  interface CompetitionStage {
    id: number;
    competition_id: number;
    name: string;
    type: 'group' | 'knockout';
    order: number;
    status: 'pending' | 'in_progress' | 'completed';
  }

  // 比赛报名
  interface Registration {
    id: number;
    competition_id: number;
    player_id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at?: string;
    competition?: Competition;
    player?: CurrentUser;
  }

  // 比赛分组
  interface Group {
    id: number;
    competition_id: number;
    stage_id: number;
    name: string;
    players?: { id: number; name: string; rank?: number; points?: number; }[];
  }

  // 比赛对阵
  interface Match {
    id: number;
    competition_id: number;
    stage_id: number;
    group_id?: number;
    player1_id: number;
    player2_id: number;
    player1_score: number;
    player2_score: number;
    status: 'pending' | 'in_progress' | 'completed';
    scheduled_time?: string;
    winner_id?: number;
    player1?: CurrentUser;
    player2?: CurrentUser;
    winner?: CurrentUser;
    group?: Group;
    scores?: Score[];
  }

  // 评分
  interface Score {
    id: number;
    match_id: number;
    player_id: number;
    judge_id: number;
    score: number;
    comments?: string;
    judge?: CurrentUser;
  }
} 