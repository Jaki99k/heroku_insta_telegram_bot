const sample = require('lodash');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');
const IgApiClient = require('instagram-private-api').IgApiClient;
const ig = new IgApiClient();
const bot = new Telegraf('632800680:AAGv3jX7eAxF69KUXUx2uMksfW7VUFBoVQE');

ig.state.generateDevice('n00bway');
var global_pk = '';

async function get_pk(user_base_infos) {
    return user_base_infos.pk;
}

async function create_message(user_advanced_infos) {
    var answer_mex = '';
    answer_mex = '🔮 Details : \n\n';
    answer_mex += `👽 Full Name : ${user_advanced_infos.full_name}\n`;
    answer_mex += `👨‍ Username : '${user_advanced_infos.username}\n\n`;
    answer_mex += `📸 Total posts : ${user_advanced_infos.media_count}\n`;
    answer_mex += `⏮️ Followers : ${user_advanced_infos.follower_count}\n`;
    answer_mex += `⏭️ Following : ${user_advanced_infos.following_count}\n\n`;
    if (user_advanced_infos.is_private == false) {
        answer_mex += `🔐 Private profile: ❌\n\n`;
    } else {
        answer_mex += `🔐 Private profile: ✅\n\n`;
    }
    answer_mex += `📝 Biography : \n${user_advanced_infos.biography}`;
    return answer_mex;
}

(async() => {
    console.log('[/] Logging in ...');
    await ig.account.login('n00bway', 'camillino197');
    console.log('[+] Logged in successfull!');

    bot.on('callback_query', async(ctx) => {
        var callbackData = ctx.callbackQuery.data;
        var chat_id = ctx.callbackQuery.from.id;

        console.log(chat_id);

        var user_advanced_infos = await ig.user.info(global_pk);

        switch (callbackData) {
            case 'get_stories':
                console.log('get_stories');
                const reelsFeed = ig.feed.reelsMedia({
                    userIds: [global_pk],
                });
                const storyItems = await reelsFeed.items();
                //console.log(storyItems[0]);
                if (storyItems.length === 0) {
                    ctx.reply('Target user story is empty!');
                } else {
                    for (var i = 0; i < storyItems.length; i++) {
                        if ('image_versions2' in storyItems[i] && 'video_versions' in storyItems[i]) {
                            console.log('The story is a video');
                            //bot.telegram.sendPhoto(chat_id, );
                            //console.log(storyItems[2]['video_versions'][0].url);
                            bot.telegram.sendVideo(chat_id, storyItems[i]['video_versions'][0].url);
                        } else {
                            console.log('The story is an image');
                            //console.log(storyItems[i]['image_versions2']['candidates'][0].url);
                            bot.telegram.sendPhoto(chat_id, storyItems[i]['image_versions2']['candidates'][0].url);
                        }
                    }
                }
                break;
            case 'get_profile_pic':
                //console.log(user_advanced_infos['hd_profile_pic_url_info']['url']);
                bot.telegram.sendPhoto(chat_id, user_advanced_infos['hd_profile_pic_url_info']['url'])
                break;
        }
    });

    //List of bot commands
    bot.start((ctx) => ctx.reply('Welcome, just send me a instagram username! 😀', ));
    bot.on('message', async(ctx) => {
        var user = 'n00bway';
        user = ctx.message.text;
        var user_base_infos = await ig.user.searchExact(user);
        var pk = await get_pk(user_base_infos);
        global_pk = pk;
        var user_advanced_infos = await ig.user.info(pk);
        var message = await create_message(user_advanced_infos);
        //ctx.reply(message);
        ctx.reply(
            message,
            Markup.inlineKeyboard([
                Markup.callbackButton('📸 Stories', 'get_stories'),
                Markup.callbackButton('🃏 Profile Pic', 'get_profile_pic'),
                Markup.callbackButton('👩🏼‍💻 Developer', 'developer_options'),
            ]).extra()
        );
    });

    bot.launch();
})();

//For bot name 📡