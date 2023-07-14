const MATCH_PATTERNS = {
  projects: /^\/projects\/(?:editor|\d+(?:\/(?:fullscreen|editor))?)\/?$/, // Matches /projects/editor, /projects/<id>/fullscreen, /projects/<id>/editor
  projectEmbeds: /^\/projects\/\d+\/embed\/?$/, // Matches /projects/<id>/embed
  studios: /^\/studios\/\d+(?:\/(?:projects|comments|curators|activity))?\/?$/, // Matches /studios/<id>, /studios/<id>/projects, /studios/<id>/comments, /studios/<id>/curators, /studios/<id>/activity
  profiles: /^\/users\/[\w-]+\/?$/, // Matches /users/<username>
  topics: /^\/discuss\/topic\/\d+\/?$/, // Matches /discuss/topic/<id>
  newPostScreens: /^\/discuss\/(?:topic\/\d+|\d+\/topic\/add)\/?$/, // Matches /discuss/topic/<id>, /discuss/<id>/topic/add
  editingScreens: /^\/discuss\/(?:topic\/\d+|\d+\/topic\/add|post\/\d+\/edit|settings\/[\w-]+)\/?$/, // Matches /discuss/topic/<id>, /discuss/<id>/topic/add, /discuss/post/<id>/edit, /discuss/settings/<param>
  forums: /^\/discuss(?!\/m(?:$|\/))(?:\/.*)?$/, // Matches /discuss, /discuss/<any>
  // scratch-www routes, not including project pages
  // Matches /projects (an error page) but not /projects/<id>
  scratchWWWNoProject: /^\/(?:(?:about|annual-report(?:\/\d+)?|camp|conference\/20(?:1[79]|[2-9]\d|18(?:\/(?:[^\/]+\/details|expect|plan|schedule))?)|contact-us|code-of-ethics|credits|developers|DMCA|download(?:\/(?:scratch2|scratch-link))?|educators(?:\/(?:faq|register|waiting))?|explore\/(?:project|studio)s\/\w+(?:\/\w+)?|community_guidelines|faq|ideas|join|messages|parents|privacy_policy(?:\/apps)?|research|scratch_1\.4|search\/(?:project|studio)s|starter-projects|classes\/(?:complete_registration|[^\/]+\/register\/[^\/]+)|signup\/[^\/]+|terms_of_use|wedo(?:-legacy)?|ev3|microbit|vernier|boost|studios\/\d*(?:\/(?:projects|comments|curators|activity))?|components|become-a-scratcher|projects)\/?)?$/,
};

export default MATCH_PATTERNS;