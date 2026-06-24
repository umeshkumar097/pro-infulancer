import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './ResultPage.css';

const ResultPage = () => {
  const resultRef = React.useRef(null);
  const location = useLocation();
  const { scores = [], userId, userName = 'Participant' } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Automatically generate PDF and send email after rendering
    if (userId) {
      const timer = setTimeout(() => {
        sendEmailWithPDF();
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const sendEmailWithPDF = async () => {
    const pages = document.querySelectorAll('.pdf-page');
    if (!pages || pages.length === 0) return;
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, 1123]
      });

      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { 
          scale: 1.5, // Good balance of quality and file size
          useCORS: true,
          scrollY: 0
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        
        if (i > 0) {
          pdf.addPage([794, 1123], 'portrait');
        }
        pdf.addImage(imgData, 'JPEG', 0, 0, 794, 1123, undefined, 'FAST');
      }
      
      const pdfBase64 = pdf.output('datauristring');

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      await fetch(`${API_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, pdfBase64 })
      });
      console.log('Result email sent successfully');
    } catch (err) {
      console.error('Error generating or sending PDF:', err);
    }
  };

  if (!Array.isArray(scores) || scores.length === 0) {
    return <p>No scores to display</p>;
  }

  // Sort scores
  const sortScores = (scores) =>
    [...scores]
      .map(s => ({ ...s, score: Math.floor(s.score) }))
      .sort((a, b) => b.score - a.score);

  const sortedScores = sortScores(scores);
  const totalScore = 120;

  const pieData = [
    ['Trait', 'Percentage'],
    ...sortedScores.map(score => [
      `${score.trait} (${((score.score / totalScore) * 100).toFixed(1)}%)`,
      Number(((score.score / totalScore) * 100).toFixed(1))
    ])
  ];

  const colorMap = {
    'Reasoning': '#FF6384',
    'Visionary': '#FFA726',
    'Leverage': '#AB47BC',
    'Assertiveness': '#FFD54F',
    'Friendly Persuasion': '#66BB6A',
    'Bargaining': '#42A5F5'
  };

  const highestScore = sortedScores[0].score;

  const slices = sortedScores.map(score => ({
    color: colorMap[score.trait],
    offset: score.score === highestScore ? 0.2 : 0
  }));

  const options = {
    title: '',
    is3D: true,
    pieSliceText: 'label',
    slices,
    tooltip: { text: 'percentage' },
    chartArea: { width: '90%', height: '90%' },
    backgroundColor: 'transparent',
    legend: 'none',
    pieSliceTextStyle: { color: 'black', fontSize: 17 },
    pieSliceBorderColor: '#000000',
    sliceVisibilityThreshold: 0
  };

  const generateCardContent = (trait, score) => {
    let title = '';
    let content = '';

    if (trait === 'Assertiveness') {
      if (score >= 0 && score <= 10) {
        title = 'Assertiveness: Passive Suggester (The Wallflower)';
        content = '<p>You thrive on harmony. Expressing your needs or opinions can feel like walking a tightrope, so you often stay silent to avoid confrontation or disapproval. Decisions become a spectator sport for you, content to follow the lead of others and rarely volunteering your own suggestions unless explicitly asked. This keeps you under the radar, but it can also mean your desires and thoughts remain hidden, potentially leading to frustration and missed opportunities.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Assertiveness: Hesitant Advocate (The Dropper of Hints)';
        content = '<p>You crave a harmonious atmosphere. Direct communication, especially about your own needs, feels like a potential disruption. To avoid ruffling feathers, you often keep your thoughts and desires to yourself. Even expressing opinions can be a hurdle, leading you to drop hints or take roundabout approaches in hopes of getting your point across subtly. This reliance on unspoken cues can sometimes backfire, resulting in misunderstandings and missed opportunities.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Assertiveness: Logical Advocate (The Confident Communicator)';
        content = '<p>You are known for your clear and confident communication style. You feel comfortable expressing your needs and opinions directly while also remaining open to listening to others\' perspectives. In discussions, you present your arguments logically and strive for win-win situations, always seeking understanding and collaboration. Your assertiveness is balanced with respect, making you a valuable contributor to any conversation or decision-making process.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Assertiveness: The Persuasive Influencer (The Compelling Advocate)';
        content = '<p>You are adept at wielding strong conviction and well-reasoned arguments as powerful tools. You confidently articulate your needs and opinions, rooted in firm beliefs and clear reasoning. Instead of manipulation, you employ persuasion, emphasizing the benefits and logical foundations of your ideas. You thrive on collaboration and open-mindedness, skilfully considering diverse perspectives while effectively advocating for your own, frequently achieving outcomes that bring mutual benefits to all involved.</p>';
      } else if (score > 40) {
        title = 'Assertiveness: The Dominating Dictator (The Power Player)';
        content = '<p>You are someone who demands compliance rather than earning it through mutual understanding. You assert your needs forcefully, often dominating conversations and overlooking opposing perspectives. Utilizing ultimatums and threats to achieve your objectives, you may create a competitive atmosphere that can strain relationships and dampen creativity. The relentless focus on winning can foster resentment and diminish others\' willingness to engage constructively.</p>';
      }
    }

    else if (trait === 'Bargaining') {
      if (score >= 0 && score <= 10) {
        title = 'Bargaining: The Reluctant Bargainer (The Logical Analyst)';
        content = '<p>You thrive in a calm, data-driven environment. You prioritize factual evidence and logical reasoning, seeing emotions as distractions. While your analytical skills are valuable, your lack of broader vision can limit creative engagement and strategic impact.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Bargaining: The Pragmatic Influencer (The Trust Builder)';
        content = '<p>Building trust and understanding is paramount for you. You weave logical arguments with optimism, fostering rapport and shared goals. By highlighting potential benefits, you encourage open discussions, leading to win-win scenarios where both you and your audience feel heard.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Bargaining: The Collaborative Visionary (The Shared Future Architect)';
        content = '<p>Collaboration is your cornerstone. You excel at fostering open communication and emphasizing mutual benefits. Using positive language and compelling stories, you create a picture of shared success, prioritizing long-term relationships and continued influence.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Bargaining: The Persuasive Advocate (The Enthusiastic Champion)';
        content = '<p>Passion and persuasion are your tools. You use vivid language to champion your message, ensuring a win-win solution. Your enthusiasm guides your audience toward mutually beneficial outcomes, while remaining open to feedback and creative solutions.</p>';
      } else if (score > 40) {
        title = 'Bargaining: The Dominating Influencer (The Win-at-All-Costs Enforcer)';
        content = '<p>You use forceful persuasion, risking long-term engagement. Aggressiveness and limited willingness to compromise characterize your approach. While effective short-term, this can create a hostile environment, damaging relationships and stifling creativity.</p>';
      }
    }

    else if (trait === 'Friendly Persuasion') {
      if (score >= 0 && score <= 10) {
        title = 'Friendly Persuasion: Quiet Supporter (Off-the-Cuff Communicator)';
        content = '<p>You are approachable and agreeable, but hesitant to contribute ideas or participate in discussions. You rely heavily on improvisation and intuition, with minimal preparation beyond the core message. This approach may make it challenging to connect with the audience on a personal level or tailor your message for maximum impact.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Friendly Persuasion: Collaborative Builder (Information Gatherer)';
        content = '<p>You are enthusiastic and relationship-oriented. You listen actively and encourage participation but may not always express your own opinions. You conduct basic research to understand the audience\'s general interests or needs and focus on delivering clear information. However, there may be missed opportunities for personalization or emotional connection.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Friendly Persuasion: Engaged Facilitator (Relationship Builder)';
        content = '<p>You balance friendliness with assertiveness. You express ideas clearly while being open to others\' perspectives. You actively gather information and insights about the audience\'s values, interests, and concerns. You aim to build rapport and create a welcoming environment for your message, preparing points that resonate with the audience\'s perspective.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Friendly Persuasion: Charismatic Persuader and Storytelling Strategist';
        content = '<p>You are highly attuned to the needs and emotions of others. You tailor your communication style to individuals and situations, focusing on harmony over expressing your own needs at times. You develop compelling narratives that align with the audience\'s interests and emotions, crafting messages that are informative and emotionally engaging. You anticipate objections and prepare responses that maintain a positive and collaborative tone.</p>';
      } else if (score > 40) {
        title = 'Friendly Persuasion: Overly Dominant Influencer';
        content = '<p>You project a very friendly and agreeable demeanor, sometimes appearing overly accommodating to gain favor. Your excessive preparation can lead to a scripted and inauthentic presentation, making it challenging to adapt to the audience\'s energy or respond to unexpected reactions. Your focus on performance may overshadow the genuine connection needed for effective persuasion.</p>';
      }
    }

    else if (trait === 'Leverage') {
      if (score >= 0 && score <= 10) {
        title = 'Leverage: The Timid Leverager (The Quiet Follower)';
        content = '<p>You operate under the radar, hesitant to leverage your connections or social networks. You prefer to follow the lead of others and avoid taking initiative. Your influence stems primarily from association rather than active engagement.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Leverage: The Cautious Networker (The Strategic Connector)';
        content = '<p>You strategically use connections, but with a cautious approach. You value consensus and collaboration before taking action. While you might not be the most outgoing, you consciously build relationships with important people.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Leverage: The Savvy Influencer (The Collaborative Advocate)';
        content = '<p>You are confident and adept at navigating social situations. You frame proposals and ideas within the context of power dynamics while maintaining a collaborative approach.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Leverage: The Power Broker (The Charismatic Persuader)';
        content = '<p>You possess charisma and a strong focus on securing support for your goals. You build consensus by aligning interests and emphasizing shared benefits.</p>';
      } else if (score > 40) {
        title = 'Leverage: The Dominator (The Unilateral Dictator)';
        content = '<p>You employ forceful tactics, often disregarding dissenting opinions. While effective short-term, this can damage relationships and reduce long-term influence.</p>';
      }
    }

    else if (trait === 'Reasoning') {
      if (score >= 0 && score <= 10) {
        title = 'Reasoning: The Subtle Analyst';
        content = '<p>You prefer a more intimate and personalized approach, explaining ideas calmly and clearly while fostering trust and understanding.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Reasoning: The Logical Advocate';
        content = '<p>You build airtight arguments, anticipating objections and persuading through facts and clarity.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Reasoning: The Data-Driven Leader';
        content = '<p>You rely heavily on data, research, and evidence to establish authority and confidence.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Reasoning: The Persuasive Analyst';
        content = '<p>You tailor analytical insights into compelling narratives that resonate with specific audiences.</p>';
      } else if (score > 40) {
        title = 'Reasoning: The Relentless Investigator';
        content = '<p>Your focus on detail may overwhelm others, making balance essential for sustained influence.</p>';
      }
    }

    else if (trait === 'Visionary') {
      if (score >= 0 && score <= 10) {
        title = 'Visionary: The Subtle Visionary (The Seed Planter)';
        content = '<p>You gently introduce future-oriented ideas, building trust slowly through logic and reassurance.</p>';
      } else if (score >= 11 && score <= 20) {
        title = 'Visionary: The Inspiring Leader (The Storyteller of Possibilities)';
        content = '<p>You inspire optimism using positive language and compelling narratives.</p>';
      } else if (score >= 21 && score <= 30) {
        title = 'Visionary: The Passionate Champion (The Firestarter)';
        content = '<p>Your enthusiasm and vivid imagery motivate others to rally behind a shared purpose.</p>';
      } else if (score >= 31 && score <= 40) {
        title = 'Visionary: The Energizer (The Spark Plug)';
        content = '<p>You drive excitement and momentum, motivating action through infectious enthusiasm.</p>';
      } else if (score > 40) {
        title = 'Visionary: The Dominant Visionary (The Overbearing Architect)';
        content = '<p>Your forceful vision may stifle dissent and creativity, creating polarization.</p>';
      }
    }

    return { title, content };
  };


  return (
    <div className="result-page" ref={resultRef}>
      <h1 className="result-title">Your Behavioural Compass</h1>

      <div className="pie-container">
        <Chart
          chartType="PieChart"
          data={pieData}
          options={options}
          width="100%"
          height="700px"
        />
      </div>

      <div className="legend-container">
        {sortedScores.map(score => (
          <div key={score.trait} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: colorMap[score.trait] }}
            />
            <span className="legend-text">{score.trait}</span>
          </div>
        ))}
      </div>

      <h2 className="signature-themes-title">Signature Themes</h2>

      <div className="scores-box">
        <h2>Scores</h2>
        <ul className="scores-list">
          {sortedScores.map(score => (
            <li key={score.trait} className="score-item">
              {score.trait}: {score.score}
            </li>
          ))}
        </ul>
      </div>

      <div className="result-content">
        {sortedScores.map(score => {
          const { title, content } = generateCardContent(score.trait, score.score);
          const cardClass = `result-card ${score.trait.toLowerCase().replace(/\s/g, '-')}`;

          return (
            <div key={score.trait} className={cardClass}>
              <h2>{title}</h2>
              <p dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          );
        })}
      </div>

      {/* Hidden container for PDF Generation */}
      <div className="pdf-report-container">
        {/* Page 1: Intro */}
        <div className="pdf-page">
          <div className="pdf-header-title">Behaviour Compass. Find Your True North</div>
          <div className="pdf-greeting">Dear {userName},</div>
          <p>Congratulations on completing your self-discovery journey! Now, embark on a transformative adventure.</p>
          <p>Just like a compass unwavering in its direction, the Behavioural Compass is your guide to identifying your own unwavering principles and uncovering your own true north. These are the values, beliefs, and motivations that define who you are at your core.</p>
          <p>The Behavioural Compass is more than just self-discovery – it's a transformative journey that impacts every aspect of your life. In the workplace, you'll develop a deep sense of purpose, leading with authenticity and inspiring trust in your colleagues. Imagine making decisions with unwavering confidence, knowing that they're aligned with your core compass.</p>
          <p>Personally, this discovery equips you to face challenges with a newfound strength. You'll build stronger, more meaningful relationships and experience a profound sense of satisfaction as you navigate life's journey with clear direction.</p>
          <p>The Behavioural Compass isn't about temporary fixes or fleeting trends. It's about uncovering the very essence of who you are. It's the map to a life lived with purpose, where your inner compass guides you towards fulfilment and genuine success, both professionally and personally.</p>
          <p>So, get ready to chart your course.</p>
          <div className="pdf-footer">Crux Management Services Pvt.Ltd</div>
        </div>

        {/* Page 2: Scores & Pie Chart */}
        <div className="pdf-page">
          <div className="pdf-page-2-title">Behavioural Compass Report</div>
          <div className="pdf-scores-title">Scores:</div>
          <ul className="pdf-scores-list">
            {sortedScores.map(score => (
              <li key={score.trait}>{score.trait}: {score.score}</li>
            ))}
          </ul>
          <div className="pdf-pie-container">
            <Chart
              chartType="PieChart"
              data={[
                ['Trait', 'Percentage'],
                ...sortedScores.map(score => [
                  `${score.trait}: ${((score.score / totalScore) * 100).toFixed(1)}%`,
                  Number(((score.score / totalScore) * 100).toFixed(1))
                ])
              ]}
              options={{
                ...options,
                is3D: false,
                chartArea: { width: '95%', height: '95%' },
                pieSliceTextStyle: { color: 'black', fontSize: 11 }
              }}
              width="500px"
              height="350px"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap', padding: '0 40px' }}>
            {sortedScores.map(score => (
              <div key={score.trait} style={{ display: 'flex', alignItems: 'center', marginRight: '15px', marginBottom: '10px' }}>
                <div style={{ width: '15px', height: '15px', marginRight: '8px', backgroundColor: colorMap[score.trait] }} />
                <span style={{ fontSize: '14px', fontFamily: "'Times New Roman', Times, serif" }}>{score.trait}</span>
              </div>
            ))}
          </div>
          <div className="pdf-footer">Crux Management Services Pvt.Ltd</div>
        </div>

        {/* Page 3: Traits */}
        <div className="pdf-page">
          {sortedScores.map(score => {
            const { title, content } = generateCardContent(score.trait, score.score);
            return (
              <div key={score.trait}>
                <div className="pdf-trait-title">{title}</div>
                <div className="pdf-trait-desc" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            );
          })}
          <div className="pdf-footer">Crux Management Services Pvt.Ltd</div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;