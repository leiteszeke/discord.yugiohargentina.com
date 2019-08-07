const tournaments = [
    { id: 1, name: 'Torneo 1' },
    { id: 2, name: 'Torneo 2' },
];

const users = [];

const Tournament = {
    sayHi: (data) => {
        if (data.content.toLowerCase() === 'hola') {
          data.reply(`Hola ${ data.user.username }. ¿En qué torneo te queres inscribir?`);
          data.reply(`${ tournaments.map(tournament => `${ tournament.id } - ${ tournament.name }\r\n`) }`);
          users[data.user.id].step = 2;
          return;
        }

        return data.reply('Un buen duelista empieza una conversación con un "Hola"');
    },

    askForTournament: (data) => {
        if (!isNaN(data.content) && (event = tournaments.find(tournament => tournament.id === parseInt(data.content)))) {
            data.reply(`Bienvenido al torneo ${ event.name }`);
            data.reply(`Para finalizar tu inscripción, debes enviar las 2 decklist que vas a usar`);
            users[data.user.id].step = 3;
            return;
        }

        return data.reply('El torneo que ingresaste no existe.');
    },

    getDecklists: (data) => {
        const user = users[data.user.id];

        if (data.attachments) {
            if (data.attachments.length === 1) {
                if (!user.files || user.files.length === 0) {
                    user.files = [data.attachments];
                    return data.reply('Bien, la primer decklist ha sido cargada.');
                }

                if (user.files.length === 1) {
                    user.files.push(data.attachments);
                    return data.reply('Bien, has terminado de cargar tus decklists.');
                }

              data.reply('Oh, Ya has cargado las 2 decklists permitidas.');
            } else if (data.attachments.length === 2) {
                if (user.files && user.files.length === 1) {
                    return data.reply('Ya tienes cargada una decklist, no puedes subir 2 más.');
                }

                user.files = [];
                data.attachments.map(attachment => user.files.push(attachment));
                return data.reply('Bien, has cargado tus 2 decklists.');
            }

            return data.reply('Estas intentando cargar mas decklists de las permitidas.');
        }

        return data.reply('Seguimos esperando que cargues tus decklists.');
    },

    getUserStep: (data) => {
        if (!users[data.user.id]) {
            users[data.user.id] = {
                step: 1,
            };
        }

        return users[data.user.id].step;
    }
};

module.exports = Tournament;