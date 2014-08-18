//Users

var tributeToAaron = {
    username: 'aaronsw',
    name: 'Aaron Swartz Tribute',
    location: 'Brooklyn, NYC',
    credential_type: 'builtin',
    credential_username: 'aaronsw',
    credential_password: 'liks345F',
    email: 'me@aaronsw.com',
    picture_src: '/public/images/0/user.jpg',
    picture_small: '/public/images/0/user_t.jpg',
    about: 'Aaron Hillel Swartz was an American computer programmer, writer, political organizer and Internet activist. Swartz was involved in the development of RSS, Creative Commons, web.py and Reddit.'
};

var jeswin = {
    username: 'jeswin',
    name: 'Jeswin',
    location: 'Bangalore, India',
    credential_type: 'twitter',
    credential_id: '15833712',
    credential_username: 'jeswin',
    credential_accessToken: 'invalid_token',
    credential_accessTokenSecret: 'invalid_token_secret',
    email: 'jeswinpk@agilehead.com',
    picture_src: '/public/images/0/user.jpg',
    picture_small: '/public/images/0/user_t.jpg',
    about: 'Founder of Poetry(poe3.com). Proud sponsor of the RedBull F1 team by way of drinking too many cans.'
};

var ebin = {
    username: 'ebin',
    name: 'Ebin John',
    location: 'Bangalore, India',
    credential_type: 'builtin',
    credential_username: 'ebin',
    credential_password: 'liks345F',
    email: 'ebin.john@outlook.com',
    picture_src: '/public/images/0/user.jpg',
    picture_small: '/public/images/0/user_t.jpg',
};

var anupk7 = {
    username: 'anupk7',
    name: 'Anup Kesavan',
    location: 'Bangalore, India',
    credential_type: 'builtin',
    credential_username: 'anupk7',
    credential_password: 'liks345F',
    email: 'anupk7@gmail.com',
    picture_src: '/public/images/0/user.jpg',
    picture_small: '/public/images/0/user_t.jpg',
};

var users = [tributeToAaron, jeswin, ebin, anupk7];

//Apps
var poetry = {
    name: 'Poetry',
    description: 'Selected Poetry from around the world.',
    cover_image_src: 'http://us.cdn281.fansshare.com/photos/dreehemingway/full-dree-hemingway-tv-2077415311.jpg',
    cover_image_small: 'http://us.cdn281.fansshare.com/photos/dreehemingway/full-dree-hemingway-tv-2077415311.jpg',
    permission: 'public',
    access: 'public',
    category: 'literature',
    _createdBy: 'jeswin',
    posttypes: 'haiku,article'
}

movies = {
    name: 'Modern Cinema',
    description: 'Movies that won\'t make any sense. Not now, not ever.',
    cover_image_src: 'http://fc01.deviantart.net/fs71/i/2012/224/8/6/charlie_chaplin_02__conceptual_fashion__by_lastwishes-d5au8rm.jpg',
    cover_image_small: 'http://fc01.deviantart.net/fs71/i/2012/224/8/6/charlie_chaplin_02__conceptual_fashion__by_lastwishes-d5au8rm.jpg',
    permission: 'public',
    access: 'public',
    category: 'movies',
    _createdBy: 'jeswin'
};

var rawNerve = {
    name: 'Raw Nerve',
    description: 'This is a series of pieces on getting better at life.',
    cover_image_src: 'http://blogs-images.forbes.com/singularity/files/2013/01/Aaron_Swartz.jpg',
    cover_image_small: 'http://blogs-images.forbes.com/singularity/files/2013/01/Aaron_Swartz.jpg',
    permission: 'public',
    access: 'public',
    category: 'life',
    theme: 'paper-theme',
    _about: 'about-raw-nerve.md',
    _message: 'message-raw-nerve.md',
    _createdBy: 'aaronsw'
};

var itsMyLife = {
    name: 'It\'s my life',
    description: 'Everyday life from corners of the world.',
    cover_image_src: 'http://www.dangerouslybored.com/wp-content/uploads/2012/10/clown-7.jpg',
    cover_image_small: 'http://www.dangerouslybored.com/wp-content/uploads/2012/10/clown-7.jpg',
    permission: 'public',
    access: 'public',
    category: 'life',
    _createdBy: 'jeswin'
};

var makingStuff =  {
    name: 'Making Stuff',
    description: 'Everybody can make stuff. This is about stuff you\'ve made.',
    cover_image_src: 'http://cdnimg.visualizeus.com/thumbs/aa/06/colors,colours,costume,derro,fancy,dress,festival-aa06d899eec02dec6f84cb017ea3bf80_h.jpg',
    cover_image_small: 'http://cdnimg.visualizeus.com/thumbs/aa/06/colors,colours,costume,derro,fancy,dress,festival-aa06d899eec02dec6f84cb017ea3bf80_h.jpg',
    permission: 'public',
    access: 'public',
    category: 'life',
    _createdBy: 'jeswin'
}

travel = {
    name: 'Travel',
    description: 'Let\'s go.',
    cover_image_src: 'http://farm4.staticflickr.com/3016/3008866354_7481cc3f70_z.jpg',
    cover_image_small: 'http://farm4.staticflickr.com/3016/3008866354_7481cc3f70_z.jpg',
    permission: 'public',
    access: 'public',
    category: 'travel',
    _createdBy: 'jeswin'
}

computers = {
    name: 'Computers',
    description: 'Garbage in. Garbage out.',
    cover_image_src: 'http://cdn-static.zdnet.com/i/r/story/70/00/016684/apple-wwdc-mac-pro-0596610x488-610x488.jpg?hash=MTZjLGH0AT&upscale=1',
    cover_image_small: 'http://cdn-static.zdnet.com/i/r/story/70/00/016684/apple-wwdc-mac-pro-0596610x488-610x488.jpg?hash=MTZjLGH0AT&upscale=1',
    permission: 'public',
    access: 'public',
    category: 'technology',
    _createdBy: 'jeswin'
};

var theGreatMasters = {
    name: 'Great Masters',
    description: 'Paintings from the great masters.',
    cover_image_src: 'http://www.claude-monet.com/images/paintings/impression-sunrise.jpg',
    cover_image_small: 'http://www.claude-monet.com/images/paintings/impression-sunrise.jpg',
    permission: 'public',
    access: 'public',
    category: 'art',
    _createdBy: 'jeswin'
};

var streetFood = {
    name: 'Street Food',
    description: 'Dai Pai Dong to Vada Pav. The love of street food.',
    cover_image_src: 'http://shecookshecleans.files.wordpress.com/2011/07/korean-chic-skewers.jpg?w=500',
    cover_image_small: 'http://shecookshecleans.files.wordpress.com/2011/07/korean-chic-skewers.jpg?w=500',
    permission: 'public',
    access: 'public',
    category: 'food-and-drinks',
    _createdBy: 'jeswin'
};

var guzzlers = {
    name: 'Guzzlers',
    description: 'Calling Beer guzzlers. We are already a few pitchers down.',
    cover_image_src: 'http://media.tumblr.com/tumblr_mdlnc6eBsm1qd0jy3.jpg',
    cover_image_small: 'http://media.tumblr.com/tumblr_mdlnc6eBsm1qd0jy3.jpg',
    permission: 'public',
    access: 'public',
    category: 'food-and-drinks',
    _createdBy: 'jeswin'
};

var earlyMornings = {
    name: 'Early Mornings',
    description: 'Waking up early. Catching the day in its best act.',
    cover_image_src: 'http://www.minigallery.co.uk/Erica_Kirkpatrick/images/20120426093259079_l/large/Misty_Pond_Landscape_42.jpg',
    cover_image_small: 'http://www.minigallery.co.uk/Erica_Kirkpatrick/images/20120426093259079_l/large/Misty_Pond_Landscape_42.jpg',
    permission: 'public',
    access: 'public',
    category: 'life',
    _createdBy: 'jeswin'
}

apps = [poetry, movies, rawNerve, itsMyLife, makingStuff, travel, computers, theGreatMasters, streetFood, guzzlers, earlyMornings]

//Articles
believeYouCanChange = {
    title: 'Believe you can change',
    type: "records/article/1.0.0",
    _content: 'believe-you-can-change.md',
    cover_image_src: 'http://3.bp.blogspot.com/-v3u0buEsK5E/T7XVL4nuUtI/AAAAAAAACu8/2Hte6GPRJ_M/s1600/dolphin.png',
    cover_image_small: 'http://3.bp.blogspot.com/-v3u0buEsK5E/T7XVL4nuUtI/AAAAAAAACu8/2Hte6GPRJ_M/s1600/dolphin.png',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var cherishMistakes = {
    title: 'Cherish Mistakes',
    type: "records/article/1.0.0",
    _content: 'cherish-mistakes.md',
    cover_image_src: 'http://img2.etsystatic.com/008/0/5851351/il_fullxfull.370263870_r8lg.jpg',
    cover_image_small: 'http://img2.etsystatic.com/008/0/5851351/il_fullxfull.370263870_r8lg.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var confrontReality = {
    title: 'Confront Reality',
    type: "records/article/1.0.0",
    _content: 'confront-reality.md',
    cover_image_src: 'http://www.cariboobrewing.com/wp-content/uploads/back-to-the-future-lloyd-michael-j-fox.jpeg',
    cover_image_small: 'http://www.cariboobrewing.com/wp-content/uploads/back-to-the-future-lloyd-michael-j-fox.jpeg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var darkKnight = {
    title: 'Dark Knight',
    type: "records/article/1.0.0",
    _content: 'dark-knight.md',
    cover_type: 'full-cover',
    cover_image_src: 'http://www.everyjoe.com/wp-content/uploads/2013/07/the-dark-knight.jpg',
    cover_image_small: 'http://www.everyjoe.com/wp-content/uploads/2013/07/the-dark-knight.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var fixTheMachine = {
    title: 'Lean into the pain',
    type: "records/article/1.0.0",
    _content: 'lean-into-the-pain.md',
    cover_type: 'auto-cover',
    cover_image_src: 'http://farm4.staticflickr.com/3808/9311339474_ec6db28a45_c.jpg',
    cover_image_small: 'http://farm4.staticflickr.com/3808/9311339474_ec6db28a45_c.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var leanIntoThePain = {
    title: 'Fix the machine not the person',
    type: "records/article/1.0.0",
    _content: 'fix-the-machine-not-the-person.md',
    cover_type: 'top-cover',
    cover_image_src: 'http://25.media.tumblr.com/tumblr_mdcyr848za1qgfiato1_1280.jpg',
    cover_image_small: 'http://25.media.tumblr.com/tumblr_mdcyr848za1qgfiato1_1280.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var lookAtYourselfObjectively = {
    title: 'Look at yourself objectively',
    type: "records/article/1.0.0",
    _content: 'look-at-yourself-objectively.md',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
}

optimalBiases = {
    title: 'Optimal biases',
    type: "records/article/1.0.0",
    _content: 'optimal-biases.md',
    cover_image_src: 'http://farm8.staticflickr.com/7330/9290232985_be2a915d39_c.jpg',
    cover_image_small: 'http://farm8.staticflickr.com/7330/9290232985_be2a915d39_c.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'pick'
};

var takeAStepBack = {
    title: 'Take a step back',
    type: "records/article/1.0.0",
    _content: 'take-a-step-back.md',
    cover_image_src: 'http://thelittlecorporal.files.wordpress.com/2012/02/great_dictator.jpg',
    cover_image_small: 'http://thelittlecorporal.files.wordpress.com/2012/02/great_dictator.jpg',
    _app: 'raw-nerve',
    _createdBy: 'aaronsw',
    _meta: 'featured'
};

var flightOfTheIcarus = {
    title: 'Flight of the Icarus',
    type: "records/article/1.0.0",
    _content: 'flight-of-the-icarus.md',
    cover_image_src: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bol%2C_Hans_-_Landscape_with_the_Fall_of_Icarus.jpg',
    cover_image_small: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Bol%2C_Hans_-_Landscape_with_the_Fall_of_Icarus.jpg',
    _app: 'raw-nerve',
    _createdBy: 'jeswin',
    _meta: 'featured'
};

var huckleberryFinn = {
    title: 'Huckleberry Finn',
    type: "records/article/1.0.0",
    _content: 'huckleberry-finn.md',
    _app: 'raw-nerve',
    _createdBy: 'jeswin',
    _meta: 'featured'
};

var records = [believeYouCanChange, cherishMistakes, confrontReality, darkKnight, fixTheMachine, leanIntoThePain,
    lookAtYourselfObjectively, optimalBiases, takeAStepBack, flightOfTheIcarus, huckleberryFinn];

exports.users = users;
exports.apps = apps;
exports.records = records;