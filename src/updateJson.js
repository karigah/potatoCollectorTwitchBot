import data from '../jsons/data.json' assert {type: 'json'}

export default function updateData(type, slicedMessage){
    switch(type){
        case 'gambaWon':
            if(isNaN(parseInt(slicedMessage[11].slice(2)))) break;

            data.potatoes = parseInt(slicedMessage[13]);
            data.totalPotatoes += parseInt(slicedMessage[11].slice(2));

        return data;
        case 'gambaLost':
            data.potatoes = parseInt(slicedMessage[14]);

        return data;
        case 'quiz':
            if(!slicedMessage[slicedMessage.length-1] == 'potatoes!') break;

            data.potatoes += parseInt(slicedMessage[slicedMessage.length-2]);

        return data;

        case 'potato/steal/cooldown':
            if(slicedMessage[1].slice(0,2) == '🥔'){
                switch(slicedMessage[2]){
                    case '[❌': /* Steals */
                    case '[✅':
                        if(isNaN(Number(slicedMessage[4].slice(2)))) break;

                        data['potatoes'] = parseInt(slicedMessage[6].replace(',',''));

                        if(slicedMessage[4][1] == '+'){
                            data['totalPotatoes'] += parseInt(slicedMessage[4].slice(2).replace(',',''));
                        }
                    break;
                    case 'Cooldowns':
                        data['potatoes'] = parseInt(slicedMessage[6]);
                    break;
                    default:
                        if(slicedMessage[2] != ('[❌Failed]' || '[✅Trampled')){
                            data['potatoes'] = parseInt(slicedMessage[4].replace(',',''));

                            if(slicedMessage[2][1] == '+'){
                                data['totalPotatoes'] += parseInt(slicedMessage[2].slice(2).replace(',',''))
                            }
                        }
                    break;
                }
            }
        return data;
    }
}