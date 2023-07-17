const getTwitchAuthorization = () => {
    let url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&grant_type=client_credentials`;
    return fetch(url, {
    method: "POST",
    })
    .then((res) => res.json())
    .then((data) => {return data;});
};

const checkLive = async (streamer) => {
    let authorizationObject = await getTwitchAuthorization();
    let { access_token, token_type } = authorizationObject;

    token_type =
    token_type.substring(0, 1).toUpperCase() +
    token_type.substring(1, token_type.length);

    let authorization = `${token_type} ${access_token}`;

    let headers = {
        authorization,
        "Client-Id": process.env.REACT_APP_CLIENT_ID,
    };

    const checkUser = `https://api.twitch.tv/helix/users?login=${streamer.toLowerCase()}`;
    let data = await fetch(checkUser, {
        headers,
    })
    .then((res) => res.json());

    let stage = 3;
    try {
        const getStream = `https://api.twitch.tv/helix/streams?type=live&user_id=${data.data[0].id}`;
        data = await fetch(getStream, {
            headers,
        })
        .then((res) => res.json());
        stage = 2;
        if( Object.keys(data.data).length === 1 ) stage = 1;
        else stage = 0;
    } catch (err) {
        console.log(`Error: ${err}`);
    }
    return stage;
}; 

export default checkLive;