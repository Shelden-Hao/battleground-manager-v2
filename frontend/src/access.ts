export default (initialState: { currentUser?: API.CurrentUser } | undefined) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  const { currentUser } = initialState ?? {};
  
  return {
    // 是否登录
    isUser: !!currentUser,
    
    // 是否为管理员
    isAdmin: currentUser?.role === 'admin',
    
    // 是否为选手
    isPlayer: currentUser?.role === 'player',
    
    // 是否为裁判
    isJudge: currentUser?.role === 'judge',
  };
};
