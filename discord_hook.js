const webhook = require('webhook-discord');


class Discorder {
    constructor(hook_url) {
        this.Hook = new webhook.Webhook(hook_url);
    }

    discordup(url, productName, productUrl, description=null, image=null, tn=null) {
        let msg = new webhook.MessageBuilder()
            .setTitle(productName)
            .setText(productUrl)
            .setDescription(`[CLICK HERE TO ADD TO CART](${url})`);
        
        if (description !== null) { msg.addField("Description: ", description); }
        if (image !== null) {msg.setImage(image);}
        if (tn !== null) {msg.setThumbnail(tn);}
        msg.setFooter("Created by DnD network", "https://image.ibb.co/gq7xgT/blackyzylogo.png")
        this.Hook.send(msg);
    }
}

module.exports = Discorder;