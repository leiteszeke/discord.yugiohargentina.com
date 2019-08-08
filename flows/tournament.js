const tournaments = [
    { id: 1, name: 'Torneo 1' },
    { id: 2, name: 'Torneo 2' },
];

const users = [];

const Tournament = {
    sayHi: (data) => {
        if (data.content.toLowerCase() === 'hola') {
          data.send(`Hola ${ data.user.username }. ¿En qué torneo te queres inscribir?`);
          data.send(`${ tournaments.map(tournament => `${ tournament.id } - ${ tournament.name }\r\n`) }`);
          users[data.user.id].step = 2;
          return;
        }

        return data.send('Un buen duelista empieza una conversación con un "Hola".');
    },

    askForTournament: (data) => {
        if (!isNaN(data.content) && (event = tournaments.find(tournament => tournament.id === parseInt(data.content)))) {
            data.send(`Bienvenido al torneo ${ event.name }.`);
            data.send('Para finalizar tu inscripción, debes enviar las 2 decklist que vas a usar.');
            data.send('Comienza cargando la primera.');
            users[data.user.id].tournament = event;
            users[data.user.id].step = 3;
            return;
        }

        return data.send('El torneo que ingresaste no existe.');
    },

    getDecklists: (data) => {
        const user = users[data.user.id];

        if (data.attachments.length > 0) {
            if (!user.files) {
                user.files = [];
            }

            if (user.files.length === 0) {
                user.files[0] = data.attachments;
                data.send('Bien, la primer decklist ha sido cargada.');
                return data.send('Ahora carga la segunda.');
            }

            if (user.files.length === 1) {
                user.files[1] = data.attachments;
                data.send('Bien, has terminado de cargar tus decklists.');
                return Tournament.askForConfirmation(data);
            }

            return data.send('Estas intentando cargar mas decklists de las permitidas.');
        }

        return data.send('Seguimos esperando que cargues tus decklists.');
    },

    getUserStep: (data) => {
        if (!users[data.user.id]) {
            users[data.user.id] = {
                step: 1,
            };
        }

        return users[data.user.id].step;
    },

    askForConfirmation: (data) => {
        data.send('Ya estas en condiciones de finalizar tu inscripción.');
        data.send(`Solo para confirmar. Te estas registrando a "${ users[data.user.id].tournament.name }" con los siguientes mazos:`, {
            files: users[data.user.id].files.map(file => file.url),
        })
        data.send('¿Confirmas?');
        data.send('1 - Si, confirmo.');
        data.send('2 - No, me arrepiento.');
        users[data.user.id].step = 4;
        return;
    },

    getConfirmation: (data) => {
        if (parseInt(data.content) === 1) {
            return Tournament.saveData(data);
        }

        if (parseInt(data.content) === 2) {
            delete users[data.user.id];
            return data.send('Has cancelado tu registro al torneo. Vuelve a empezar cuando quieras diciendome "Hola"');
        }
    },

    saveData: (data) => {
        console.log('Guardo la data y retorno lo que hice');
        return data.send(`Gracias por inscribirte a "${ users[data.user.id].tournament.name }". Mucha suerte.`);
    }
};

module.exports = Tournament;