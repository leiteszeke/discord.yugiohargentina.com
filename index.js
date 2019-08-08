require('dotenv').config();
const Discord = require('discord.js');
const Flows = require('./flows');
const client = new Discord.Client();

const parseMessage = msg => {
  return {
    user: msg.author,
    attachments: msg.attachments.map(attach => attach.message),
    content: msg.content,
    send: (message, options) => msg.channel.send(message, options),
    reply: (message) => msg.reply(message),
  };
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.author.bot || msg.channel.type !== 'dm') return;

  const data = parseMessage(msg);
  const step = Flows.Tournament.getUserStep(data);

  switch (step) {
    case 1: return Flows.Tournament.sayHi(data);
    case 2: return Flows.Tournament.askForTournament(data);
    case 3: return Flows.Tournament.getDecklists(data);
    case 4: return Flows.Tournament.getConfirmation(data);
    default: return msg.reply('No sé que decir.');
  }
});

client.on('disconnect', () => client.destroy());

client.login(process.env.APP_TOKEN);
