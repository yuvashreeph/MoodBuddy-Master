import React from 'react';

const Resources = () => {
  const sectionStyle = {
    margin: '20px 0',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const titleStyle = {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  const textStyle = {
    fontSize: '16px',
    color: '#34495e',
    lineHeight: '1.6',
  };

  const linkStyle = {
    color: '#2980b9',
    textDecoration: 'none',
  };

  const containerStyle = {
    maxWidth: '900px',
    margin: 'auto',
    padding: '30px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        Mental Health Resources
      </h1>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>🌱 Self-Help Articles</h2>
        <p style={textStyle}>
          Explore articles on topics like stress management, depression,
          anxiety, building resilience, and self-compassion. Learn coping
          techniques and how to develop a healthy mindset.
        </p>
        <ul style={textStyle}>
          <li>
            <a style={linkStyle} href="https://www.mind.org.uk/information-support/" target="_blank" rel="noreferrer">
              Mind UK – Mental Health Support
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://www.verywellmind.com" target="_blank" rel="noreferrer">
              Verywell Mind – Practical Mental Wellness Tips
            </a>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>🚨 Emergency Helplines</h2>
        <p style={textStyle}>
          If you or someone you know is in crisis or feeling suicidal, please reach out immediately:
        </p>
        <ul style={textStyle}>
          <li><strong>India:</strong> iCall - 9152987821</li>
          <li><strong>USA:</strong> National Suicide Prevention Lifeline - 988</li>
          <li><strong>UK:</strong> Samaritans - 116 123</li>
          <li>
            <a style={linkStyle} href="https://findahelpline.com" target="_blank" rel="noreferrer">
              Find more helplines worldwide
            </a>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>🧘 Meditation & Relaxation</h2>
        <p style={textStyle}>
          Guided meditations and breathing exercises can calm the mind and body.
          Use these tools daily to manage anxiety and boost mindfulness.
        </p>
        <ul style={textStyle}>
          <li>
            <a style={linkStyle} href="https://www.calm.com" target="_blank" rel="noreferrer">
              Calm – Guided Meditations
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://www.headspace.com" target="_blank" rel="noreferrer">
              Headspace – Meditation for Beginners
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://www.youtube.com/watch?v=inpok4MKVLM" target="_blank" rel="noreferrer">
              5-minute Breathing Exercise (YouTube)
            </a>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>👩‍⚕️ Therapist Directory</h2>
        <p style={textStyle}>
          Find a certified therapist or counselor near you. Many offer both in-person and virtual therapy.
        </p>
        <ul style={textStyle}>
          <li>
            <a style={linkStyle} href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noreferrer">
              Psychology Today – Therapist Finder
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://www.betterhelp.com" target="_blank" rel="noreferrer">
              BetterHelp – Online Counseling
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://www.talkspace.com" target="_blank" rel="noreferrer">
              Talkspace – Therapy by Messaging or Video
            </a>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>💬 Community Support Forums</h2>
        <p style={textStyle}>
          You're not alone. Join online communities where people share their journeys, seek advice, and support each other.
        </p>
        <ul style={textStyle}>
          <li>
            <a style={linkStyle} href="https://www.reddit.com/r/mentalhealth/" target="_blank" rel="noreferrer">
              Reddit – r/mentalhealth
            </a>
          </li>
          <li>
            <a style={linkStyle} href="https://7cups.com" target="_blank" rel="noreferrer">
              7 Cups – Free Listening & Chat Support
            </a>
          </li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2 style={titleStyle}>📘 Mental Health Journaling Apps</h2>
        <p style={textStyle}>
          Track your mood, write your thoughts, and reflect on daily progress using these journaling tools:
        </p>
        <ul style={textStyle}>
          <li><a style={linkStyle} href="https://journey.cloud/" target="_blank" rel="noreferrer">Journey App</a></li>
          <li><a style={linkStyle} href="https://www.daylio.net/" target="_blank" rel="noreferrer">Daylio – Mood Tracker & Diary</a></li>
        </ul>
      </section>
    </div>
  );
};

export default Resources;
