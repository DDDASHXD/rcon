[![Banner](https://lefobdxa9g.ufs.sh/f/EVQsPnqldSbJMcpunSzNDZC61nIuz7h80TaqOPsy3YmrKG9J)](https://rcon.skxv.dev)

SKXV RCON is a dead simlpe RCON client, built in NextJS with tailwind and [shadcn/ui](https://ui.shadcn.com).

### Usage

1. Open the website at [rcon.skxv.dev](https://rcon.skxv.dev)
2. Enter your rcon host/ip
3. Enter your rcon port
4. Enter authentication password
5. Select your game (optional)

### API usage

SKXV RCON comes with a free api, which is just as simple as using the website.

The following examples are using axios.

```ts
const data = await axios.post("https://rcon.skxv.dev/api/rcon", {
  command: "help", // string
  host: "127.0.0.1", // string
  port: 4312, // number
  password: "pwd" // string
});

return data;
/*
  returns {
    data: "list of commands: ...."
    success: true
  }
*/
```
