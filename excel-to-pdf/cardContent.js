const generateCardContent = (trait, score) => {
    let title = '';
    let content = '';
  
    if (trait === 'Assertiveness') {
      if (score >= 0 && score <= 10) {
        title = 'Assertiveness: Passive Suggester (The Wallflower)';
        content = 'You thrive on harmony. Expressing your needs or opinions can feel like walking a tightrope, so you often stay silent to avoid confrontation or disapproval. Decisions become a spectator sport for you, content to follow the lead of others and rarely volunteering your own suggestions unless explicitly asked. This keeps you under the radar, but it can also mean your desires and thoughts remain hidden, potentially leading to frustration and missed opportunities.';
      } else if (score >= 11 && score <= 20) {
        title = 'Assertiveness: Hesitant Advocate (The Dropper of Hints)';
        content = 'You crave a harmonious atmosphere. Direct communication, especially about your own needs, feels like a potential disruption. To avoid ruffling feathers, you often keep your thoughts and desires to yourself. Even expressing opinions can be a hurdle, leading you to drop hints or take roundabout approaches in hopes of getting your point across subtly. This reliance on unspoken cues can sometimes backfire, resulting in misunderstandings and missed opportunities.';
      } else if (score >= 21 && score <= 30) {
        title = 'Assertiveness: Logical Advocate (The Confident Communicator)';
        content = 'You are known for your clear and confident communication style. You feel comfortable expressing your needs and opinions directly while also remaining open to listening to others\' perspectives. In discussions, you present your arguments logically and strive for win-win situations, always seeking understanding and collaboration. Your assertiveness is balanced with respect, making you a valuable contributor to any conversation or decision-making process.';
      } else if (score >= 31 && score <= 40) {
        title = 'Assertiveness: The Persuasive Influencer (The Compelling Advocate)';
        content = 'You are adept at wielding strong conviction and well-reasoned arguments as powerful tools. You confidently articulate your needs and opinions, rooted in firm beliefs and clear reasoning. Instead of manipulation, you employ persuasion, emphasizing the benefits and logical foundations of your ideas. You thrive on collaboration and open-mindedness, skilfully considering diverse perspectives while effectively advocating for your own, frequently achieving outcomes that bring mutual benefits to all involved.';
      } else if (score > 40) {
        title = 'Assertiveness: The Dominating Dictator (The Power Player)';
        content = 'You are someone who demands compliance rather than earning it through mutual understanding. You assert your needs forcefully, often dominating conversations and overlooking opposing perspectives. Utilizing ultimatums and threats to achieve your objectives, you may create a competitive atmosphere that can strain relationships and dampen creativity. The relentless focus on winning can foster resentment and diminish others\' willingness to engage constructively.';
      }
    } else if (trait === 'Bargaining') {
      if (score >= 0 && score <= 10) {
        title = 'Bargaining: The Reluctant Bargainer (The Logical Analyst)';
        content = 'You thrive in a calm, data-driven environment. You prioritize factual evidence and logical reasoning, seeing emotions as distractions. While your analytical skills are valuable, your lack of broader vision can limit creative engagement and strategic impact.';
      } else if (score >= 11 && score <= 20) {
        title = 'Bargaining: The Pragmatic Influencer (The Trust Builder)';
        content = 'Building trust and understanding is paramount for you. You weave logical arguments with optimism, fostering rapport and shared goals. By highlighting potential benefits, you encourage open discussions, leading to win-win scenarios where both you and your audience feel heard.';
      } else if (score >= 21 && score <= 30) {
        title = 'Bargaining: The Collaborative Visionary (The Shared Future Architect)';
        content = 'Collaboration is your cornerstone. You excel at fostering open communication and emphasizing mutual benefits. Using positive language and compelling stories, you create a picture of shared success, prioritizing long-term relationships and continued influence.';
      } else if (score >= 31 && score <= 40) {
        title = 'Bargaining: The Persuasive Advocate (The Enthusiastic Champion)';
        content = 'Passion and persuasion are your tools. You use vivid language to champion your message, ensuring a win-win solution. Your enthusiasm guides your audience toward mutually beneficial outcomes, while remaining open to feedback and creative solutions.';
      } else if (score > 40) {
        title = 'Bargaining: The Dominating Influencer (The Win-at-All-Costs Enforcer)';
        content = 'You use forceful persuasion, risking long-term engagement. Aggressiveness and limited willingness to compromise characterize your approach. While effective short-term, this can create a hostile environment, damaging relationships and stifling creativity.';
      }
    } else if (trait === 'Friendly Persuasion') {
      if (score >= 0 && score <= 10) {
        title = 'Friendly Persuasion: Quiet Supporter (Off-the-Cuff Communicator)';
        content = 'You are approachable and agreeable, but hesitant to contribute ideas or participate in discussions. You rely heavily on improvisation and intuition, with minimal preparation beyond the core message. This approach may make it challenging to connect with the audience on a personal level or tailor your message for maximum impact.';
      } else if (score >= 11 && score <= 20) {
        title = 'Friendly Persuasion: Collaborative Builder (Information Gatherer)';
        content = 'You are enthusiastic and relationship-oriented. You listen actively and encourage participation but may not always express your own opinions. You conduct basic research to understand the audience|\'s general interests or needs and focus on delivering clear information. However, there may be missed opportunities for personalization or emotional connection.';
      } else if (score >= 21 && score <= 30) {
        title = 'Friendly Persuasion: Engaged Facilitator (Relationship Builder)';
        content = 'You balance friendliness with assertiveness. You express ideas clearly while being open to others\' perspectives. You actively gather information and insights about the audience\'s values, interests, and concerns. You aim to build rapport and create a welcoming environment for your message, preparing points that resonate with the audience\'s perspective.';
      } else if (score >= 31 && score <= 40) {
        title = 'Friendly Persuasion: Charismatic Persuader and Storytelling Strategist';
        content = 'You are highly attuned to the needs and emotions of others. You tailor your communication style to individuals and situations, focusing on harmony over expressing your own needs at times. You develop compelling narratives that align with the audience\'s interests and emotions, crafting messages that are informative and emotionally engaging. You anticipate objections and prepare responses that maintain a positive and collaborative tone.';
      } else if (score > 40) {
        title = 'Friendly Persuasion: Overly Dominant Influencer';
        content = 'You project a very friendly and agreeable demeanor, sometimes appearing overly accommodating to gain favor. Your excessive preparation can lead to a scripted and inauthentic presentation, making it challenging to adapt to the audience\'s energy or respond to unexpected reactions. Your focus on performance may overshadow the genuine connection needed for effective persuasion.';
      }
    } else if (trait === 'Leverage') {
      if (score >= 0 && score <= 10) {
        title = 'Leverage: The Timid Leverager (The Quiet Follower)';
        content = 'You operate under the radar, hesitant to leverage your connections or social networks. You prefer to follow the lead of others and avoid taking initiative. Your influence stems primarily from association rather than active engagement. You rely heavily on guidance and support from others, potentially missing opportunities to build your own voice and influence.';
      } else if (score >= 11 && score <= 20) {
        title = 'Leverage: The Cautious Networker (The Strategic Connector)';
        content = 'You strategically use connections, but with a cautious approach. You value consensus and collaboration before taking action. While you might not be the most outgoing, you consciously build relationships with important people, fostering a sense of trust and reciprocity. This allows you to leverage your network subtly, influencing through well-timed recommendations and collaborative initiatives.';
      } else if (score >= 21 && score <= 30) {
        title = 'Leverage: The Savvy Influencer (The Collaborative Advocate)';
        content = 'You are confident and adept at navigating social situations. You frame proposals and ideas within the context of power dynamics, understanding how different players can contribute to your goals. You use your network to advocate for yourself and your ideas but maintain a collaborative approach. You value open communication and prioritize finding solutions that benefit everyone involved, fostering long-term relationships and building a sustainable foundation for your influence.';
      } else if (score >= 31 && score <= 40) {
        title = 'Leverage: The Power Broker (The Charismatic Persuader)';
        content = 'You possess charisma and a strong focus on securing support for your goals. You use your influence to persuade others and actively build consensus, but you ultimately prioritize achieving your objectives. However, you are skilled at emphasizing potential benefits and aligning your goals with the shared interests of others. This approach creates a win-win scenario, ensuring widespread support and maximizing your influence.';
      } else if (score > 40) {
        title = 'Leverage: The Dominator (The Unilateral Dictator)';
        content = 'You employ forceful tactics, often disregarding dissenting opinions. Your focus is solely on achieving your goals, and you leverage your influence to manipulate or pressure others into compliance. While this approach might be effective in some situations, it can damage relationships and create resistance in the long run. Your dominance fosters a one-sided dynamic, hindering creative problem-solving and potentially leading to a decline in influence over time.';
      }
    } else if (trait === 'Reasoning') {
      if (score >= 0 && score <= 10) {
        title = 'Reasoning: The Subtle Analyst (The Insight Whisperer)';
        content = 'You prefer a more intimate and personalized approach. You present data and reasoning calmly and measuredly, carefully considering your audience\'s perspective. Imagine yourself as a teacher patiently explaining a concept, ensuring each step is understood before moving on. You prioritize clear and concise communication, fostering an environment where your audience feels comfortable asking questions and actively participating. While your influence might be subtle, it builds a strong foundation of trust and understanding.';
      } else if (score >= 11 && score <= 20) {
        title = 'Reasoning: The Logical Advocate (The Reason Crusader)';
        content = 'Building a clear and airtight argument is the cornerstone of your approach. You present facts and figures compellingly, anticipating and meticulously addressing potential objections. Think of yourself as a lawyer constructing your case, leaving no room for loopholes. Your focus is on logic and persuasion, using data and reasoning to build a strong case that is difficult to refute. This approach can be highly effective for complex topics, fostering a sense of confidence and trust in your audience.';
      } else if (score >= 21 && score <= 30) {
        title = 'Reasoning: The Data-Driven Leader (The Metrics Maven)';
        content = 'Data becomes the cornerstone of your influence. You leverage statistics, reports, and research to build a watertight case, leaving little room for doubt. Imagine yourself as a scientist presenting your findings, using evidence to paint an indisputable picture. You excel at translating complex data into understandable visuals and narratives, making your arguments accessible to a wider audience. This data-driven approach fosters a sense of authority and inspires confidence in your message.';
      } else if (score >= 31 && score <= 40) {
        title = 'Reasoning: The Persuasive Analyst (The Influence Maestro)';
        content = 'You excel at dissecting complex issues and presenting them in a clear, concise manner. You use your analytical skills to tailor your arguments to specific audiences, employing persuasive techniques to secure buy-in. Think of yourself as a consultant breaking down a problem and offering data-driven solutions that resonate with the client\'s needs. You understand the power of storytelling and use data to support compelling narratives that connect with your audience on an emotional level. This approach fosters a sense of collaboration and shared understanding, leading to impactful outcomes.';
      } else if (score > 40) {
        title = 'Reasoning: The Relentless Investigator (The Tenacious Detective)';
        content = 'At this level, your focus on logic can become all-consuming. You might delve into excessive technical details, potentially overwhelming the audience with data and losing sight of the bigger picture. Imagine yourself as a professor drowning students in technical jargon, sacrificing clarity for a display of intellectual prowess. This overreliance on data can alienate the audience and hinder your ability to connect with the core message. Finding a balance between detailed analysis and engaging presentation is crucial for maintaining audience engagement and maximizing influence.';
      }
    } else if (trait === 'Visionary') {
      if (score >= 0 && score <= 10) {
        title = 'Visionary: The Subtle Visionary (The Seed Planter)';
        content = 'You take a reserved approach, subtly weaving positive, future-oriented statements into conversations. You plant seeds of possibility, relying heavily on logic and reason to build initial buy-in. Gradually introducing the vision as trust is established, your slow and steady approach fosters a sense of security but might take longer to generate excitement and momentum.';
      } else if (score >= 11 && score <= 20) {
        title = 'Visionary: The Inspiring Leader (The Storyteller of Possibilities)';
        content = 'Optimism and a clear vision for the future define you. You use storytelling and positive language to paint a compelling picture of what could be. Balancing emotions with practicality, you foster a sense of hope and inspire belief in a brighter future.';
      } else if (score >= 21 && score <= 30) {
        title = 'Visionary: The Passionate Champion (The Firestarter)';
        content = 'Your visionary spirit comes alive with passion and enthusiasm. You use vivid language and imagery to describe the future, excelling at creating a sense of shared purpose. Your passion is contagious, motivating and energizing those around you to join you on the journey towards your vision.';
      } else if (score >= 31 && score <= 40) {
        title = 'Visionary: The Energizer (The Spark Plug)';
        content = 'You are highly energetic and persuasive, a captivating communicator who drives excitement and commitment to the vision. Your infectious enthusiasm motivates action, propelling the vision forward with relentless momentum. However, your intensity might seem overenthusiastic to some, potentially alienating those who prefer a more measured approach. Balancing passion and practicality is key for long-term influence.';
      } else if (score > 40) {
        title = 'Visionary: The Dominant Visionary (The Overbearing Architect)';
        content = 'At this level, your forceful personality can overshadow the vision itself. You might become overly persuasive, even manipulative, in your attempts to gain buy-in. This approach can be polarizing, inspiring strong support from some and resistance from others. Your dominance can stifle critical thinking and creativity, potentially hindering the long-term success of the vision.';
      }
    }
  
    return {
      title: title,
      content: content,
    };
  };
  
module.exports = { generateCardContent };  