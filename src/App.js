import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Character classes for Dragon Quest-style party
const CHARACTER_CLASSES = {
  WARRIOR: { name: '戦士', hp: 150, mp: 30, str: 25, def: 20, spd: 12 },
  PRIEST: { name: '僧侶', hp: 100, mp: 80, str: 12, def: 14, spd: 15 },
  MAGE: { name: '魔法使い', hp: 80, mp: 100, str: 20, def: 10, spd: 18 },
  THIEF: { name: '盗賊', hp: 110, mp: 40, str: 18, def: 16, spd: 25 },
};

// Equipment types
const EQUIPMENT = {
  weapon: {
    sword: { name: '鉄の剣', atk: 15, icon: '⚔️' },
    staff: { name: '魔法の杖', atk: 10, icon: '🪄' },
    dagger: { name: '短剣', atk: 12, icon: '🗡️' },
  },
  armor: {
    shield: { name: '盾', def: 10, icon: '🛡️' },
    robe: { name: 'ローブ', def: 5, icon: '👘' },
    helmet: { name: '兜', def: 8, icon: '⛑️' },
  },
  accessory: {
    ring: { name: '力指輪', str: 5, icon: '💍' },
    amulet: { name: 'お守り', def: 5, icon: '📿' },
  },
};

// Generate character portrait as PNG
const generatePortrait = (className, index) => {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');

  // Background
  const colors = ['#e74c3c', '#3498db', '#9b59b6', '#2ecc71'];
  ctx.fillStyle = colors[index];
  ctx.fillRect(0, 0, 100, 100);

  // Character icon
  ctx.font = '48px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const icons = ['⚔️', '✨', '🔮', '🗡️'];
  ctx.fillText(icons[index], 50, 50);

  // Border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.strokeRect(5, 5, 90, 90);

  return canvas.toDataURL('image/png');
};

// Initial party members
const initialParty = [
  { 
    id: 1, 
    name: 'アレン', 
    class: '戦士', 
    hp: 150, 
    maxHp: 150, 
    mp: 30, 
    maxMp: 30,
    equipment: { weapon: EQUIPMENT.weapon.sword, armor: EQUIPMENT.armor.shield, accessory: null },
    portrait: null,
    messages: []
  },
  { 
    id: 2, 
    name: 'ミリア', 
    class: '僧侶', 
    hp: 100, 
    maxHp: 100, 
    mp: 80, 
    maxMp: 80,
    equipment: { weapon: EQUIPMENT.weapon.staff, armor: EQUIPMENT.armor.robe, accessory: EQUIPMENT.accessory.amulet },
    portrait: null,
    messages: []
  },
  { 
    id: 3, 
    name: 'ルカ', 
    class: '魔法使い', 
    hp: 80, 
    maxHp: 80, 
    mp: 100, 
    maxMp: 100,
    equipment: { weapon: EQUIPMENT.weapon.staff, armor: null, accessory: null },
    portrait: null,
    messages: []
  },
  { 
    id: 4, 
    name: 'サラ', 
    class: '盗賊', 
    hp: 110, 
    maxHp: 110, 
    mp: 40, 
    maxMp: 40,
    equipment: { weapon: EQUIPMENT.weapon.dagger, armor: EQUIPMENT.armor.helmet, accessory: EQUIPMENT.accessory.ring },
    portrait: null,
    messages: []
  },
];

function App() {
  const [party, setParty] = useState(initialParty);
  const [chatInput, setChatInput] = useState('');
  const [selectedMember, setSelectedMember] = useState(0);
  const [showEquipment, setShowEquipment] = useState(false);
  const chatRef = useRef(null);

  // Generate portraits on mount
  useEffect(() => {
    const updatedParty = party.map((member, index) => ({
      ...member,
      portrait: generatePortrait(member.class, index)
    }));
    setParty(updatedParty);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [party]);

  // Send message function
  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'player',
      text: chatInput,
      timestamp: new Date()
    };

    const updatedParty = [...party];
    updatedParty[selectedMember].messages.push(newMessage);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: updatedParty[selectedMember].name,
        text: generateAIResponse(updatedParty[selectedMember], chatInput),
        timestamp: new Date()
      };
      updatedParty[selectedMember].messages.push(aiResponse);
      setParty([...updatedParty]);
    }, 1000);

    setParty([...updatedParty]);
    setChatInput('');
  };

  // Generate AI response
  const generateAIResponse = (member, playerMessage) => {
    const responses = [
      `了解しました！${playerMessage}についてですね。`,
      `任せてください！${member.class}としてお手伝いします。`,
      `パーティーの力になります！`,
      `いいアイデアですね！実行しましょう！`,
      `${member.name}がお応えします！`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Equipment management
  const toggleEquipment = (memberIndex, slot, itemKey) => {
    const updatedParty = [...party];
    const member = updatedParty[memberIndex];
    
    if (slot === 'weapon') {
      member.equipment.weapon = member.equipment.weapon ? null : EQUIPMENT.weapon[itemKey];
    } else if (slot === 'armor') {
      member.equipment.armor = member.equipment.armor ? null : EQUIPMENT.armor[itemKey];
    } else if (slot === 'accessory') {
      member.equipment.accessory = member.equipment.accessory ? null : EQUIPMENT.accessory[itemKey];
    }
    
    setParty(updatedParty);
  };

  return (
    <div className="app">
      <header className="dq-header">
        <h1>🐉 DRAGON QUEST PARTY CHAT 🐉</h1>
        <div className="party-info">パーティー: 4人の勇者たち</div>
      </header>

      <main className="main-content">
        {/* Party Members Panel */}
        <aside className="party-panel">
          <h2>👥 パーティーメンバー</h2>
          <div className="party-members">
            {party.map((member, index) => (
              <div 
                key={member.id} 
                className={`member-card ${selectedMember === index ? 'selected' : ''}`}
                onClick={() => setSelectedMember(index)}
              >
                <img src={member.portrait} alt={member.name} className="member-portrait" />
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className="member-class">{member.class}</div>
                  <div className="hp-bar">
                    <div className="bar-label">HP</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill hp" 
                        style={{ width: `${(member.hp / member.maxHp) * 100}%` }}
                      ></div>
                    </div>
                    <span>{member.hp}/{member.maxHp}</span>
                  </div>
                  <div className="mp-bar">
                    <div className="bar-label">MP</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill mp" 
                        style={{ width: `${(member.mp / member.maxMp) * 100}%` }}
                      ></div>
                    </div>
                    <span>{member.mp}/{member.maxMp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="equipment-btn"
            onClick={() => setShowEquipment(!showEquipment)}
          >
            そうび (Equipment)
          </button>
        </aside>

        {/* Chat Panel */}
        <section className="chat-panel">
          <div className="chat-header">
            <h2>💬 チャット - {party[selectedMember]?.name}</h2>
          </div>
          
          <div className="chat-messages" ref={chatRef}>
            {party[selectedMember]?.messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  <strong>{msg.sender === 'player' ? 'プレイヤー' : msg.sender}:</strong>
                  <p>{msg.text}</p>
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
            {party[selectedMember]?.messages.length === 0 && (
              <div className="empty-chat">
                <p>会話がまだありません。メッセージを送信してください！</p>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`${party[selectedMember]?.name}にメッセージを送る...`}
            />
            <button onClick={sendMessage}>送信</button>
          </div>
        </section>

        {/* Equipment Panel (shown when toggle) */}
        {showEquipment && (
          <aside className="equipment-panel">
            <h2>🛡️ そうび (Equipment)</h2>
            <div className="equipment-list">
              {party.map((member, index) => (
                <div key={member.id} className="member-equipment">
                  <h3>{member.name} ({member.class})</h3>
                  <div className="equipment-slots">
                    <div className="slot">
                      <label>武器:</label>
                      <span>{member.equipment.weapon ? `${member.equipment.weapon.icon} ${member.equipment.weapon.name}` : 'なし'}</span>
                      <button onClick={() => toggleEquipment(index, 'weapon', 'sword')}>剣</button>
                      <button onClick={() => toggleEquipment(index, 'weapon', 'staff')}>杖</button>
                      <button onClick={() => toggleEquipment(index, 'weapon', 'dagger')}>短剣</button>
                    </div>
                    <div className="slot">
                      <label>防具:</label>
                      <span>{member.equipment.armor ? `${member.equipment.armor.icon} ${member.equipment.armor.name}` : 'なし'}</span>
                      <button onClick={() => toggleEquipment(index, 'armor', 'shield')}>盾</button>
                      <button onClick={() => toggleEquipment(index, 'armor', 'robe')}>ローブ</button>
                      <button onClick={() => toggleEquipment(index, 'armor', 'helmet')}>兜</button>
                    </div>
                    <div className="slot">
                      <label>装飾品:</label>
                      <span>{member.equipment.accessory ? `${member.equipment.accessory.icon} ${member.equipment.accessory.name}` : 'なし'}</span>
                      <button onClick={() => toggleEquipment(index, 'accessory', 'ring')}>指輪</button>
                      <button onClick={() => toggleEquipment(index, 'accessory', 'amulet')}>お守り</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>

      <footer className="dq-footer">
        <p>🎮 DRAGON QUEST STYLE CHAT UI © 2026</p>
      </footer>
    </div>
  );
}

export default App;
