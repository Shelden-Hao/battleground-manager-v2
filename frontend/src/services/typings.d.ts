declare namespace API {
  type CurrentUser = {
    id: number;
    username: string;
    name: string;
    role: 'admin' | 'player' | 'judge';
    email?: string;
    phone?: string;
  };

  type LoginParams = {
    username: string;
    password: string;
  };

  type RegisterParams = {
    username: string;
    password: string;
    name: string;
    email?: string;
    phone?: string;
    role?: 'player' | 'judge';
  };

  type LoginResult = {
    token: string;
    user: CurrentUser;
  };

  type Match = {
    id: number;
    competition_id: number;
    stage_id: number;
    group_id?: number;
    player1_id: number;
    player2_id: number;
    winner_id?: number;
    scheduled_time?: string;
    status: 'pending' | 'in_progress' | 'completed';
    player1_score?: number;
    player2_score?: number;
    created_at: string;
    updated_at: string;
    player1?: {
      id: number;
      username: string;
      name: string;
    };
    player2?: {
      id: number;
      username: string;
      name: string;
    };
    winner?: {
      id: number;
      username: string;
      name: string;
    };
    group?: {
      id: number;
      name: string;
    };
    scores?: Score[];
  };

  type Score = {
    id: number;
    match_id: number;
    player_id: number;
    judge_id: number;
    score: number;
    comments?: string;
    created_at: string;
    updated_at: string;
    judge?: {
      id: number;
      username: string;
      name: string;
    };
  };
} 