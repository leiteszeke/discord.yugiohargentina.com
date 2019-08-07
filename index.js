require('dotenv').config();
const Discord = require('discord.js');
const Flows = require('./flows');
const client = new Discord.Client();

const parseMessage = msg => {
  return {
    user: msg.author,
    attachments: msg.attachments.map(attach => attach.message),
    content: msg.content,
    reply: msg.reply,
  };
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  const data = parseMessage(msg);
  const step = Flows.Tournament.getUserStep(data);

  switch (step) {
    case 1: return Flows.Tournament.sayHi(data);
    case 2: return Flows.Tournament.askForTournament(data);
    case 3: return Flows.Tournament.getDecklists(data);
    default: return msg.reply('No sé que decir.');
  }
});

client.login(process.env.APP_TOKEN);
