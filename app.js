const sample = require('lodash');
const Telegraf = require('telegraf');
const IgApiClient = require('instagram-private-api').IgApiClient;
const ig = new IgApiClient();
const bot = new Telegraf('632800680:AAGv3jX7eAxF69KUXUx2uMksfW7VUFBoVQE');

ig.state.generateDevice('n00bway');

async function get_pk(user_base_infos) {
    return user_base_infos.pk;
}

async function create_message(user_advanced_infos) {
    var answer_mex = '';
    answer_mex = '🔮Details : \n\n';
    answer_mex += `🗣️Full Name : ${user_advanced_infos.full_name}\n`;
    answer_mex += `👨‍Username : '${user_advanced_infos.username}\n\n`;
    answer_mex += `📸Total posts : ${user_advanced_infos.media_count}\n`;
    answer_mex += `⏮️Followers : ${user_advanced_infos.follower_count}\n`;
    answer_mex += `⏭️Following : ${user_advanced_infos.following_count}\n\n`;
    if (user_advanced_infos.is_private == false) {
        answer_mex += `🔐Private profile: ❌\n\n`;
    } else {
        answer_mex += `🔐Private profile: ✅\n\n`;
    }
    answer_mex += `📝Biography : ${user_advanced_infos.biography}`;
    return answer_mex;
}

(async() => {
    console.log('[/] Logging in ...');
    await ig.account.login('n00bway', 'camillino197');
    console.log('[+] Logged in successfull!');

    //List of bot commands
    bot.start((ctx) => ctx.reply('Welcome, to start using this bot type in the username of the person you want to search!', ));
    bot.on('message', async(ctx) => {
        var user = ctx.message.text;
        var user_base_infos = await ig.user.searchExact(user);
        var pk = await get_pk(user_base_infos);
        var user_advanced_infos = await ig.user.info(pk);
        var message = await create_message(user_advanced_infos);
        ctx.reply(message);
    });

    bot.launch();
})();