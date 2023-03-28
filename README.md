# Steampipe Cloud Zapier Integration

- Zapier: https://zapier.com
- Steampipe: https://steampipe.io
- Steampipe Cloud: https://cloud.steampipe.io
- Community: [Steampipe Slack](https://steampipe.io/community/join)

## Developing

Prerequisites:

- [Zapier CLI](https://developer.zapier.com/cli-guide/install-the-zapier-cli)
- [Node.js](https://nodejs.org/en/download)

Developing the app:

If you wish to work on the app, you'll first need to configure authentication between your dev environment and the Zapier platform. You'll use the email address and password you use to log in to the Zapier application.

```sh
zapier login
```

Clone:

To clone the Steampipe Cloud app and load its node project modules, execute the following commands in your terminal:

```sh
git clone https://github.com/turbot/steampipe-cloud-zapier.git
cd steampipe-cloud-zapier
npm install
```

To test the app, you can simply run `zapier test`.

```sh
zapier test
```

When you're ready to try your changes out on the Zapier platform use the push command.

```sh
zapier push
```

**Note:** Make sure you have changed the version by updating the version number mentioned in the `package.json` file.

Once you push your app, you'll be able to see it in the [Zapier Platform UI](https://developer.zapier.com/).
