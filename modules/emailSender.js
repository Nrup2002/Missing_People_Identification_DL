const {transporter} = require("./nodemailerSetup");
const { missingPerson , FaceData } = require("./mongoSchema");

function informingMsg(person,informer){
    msg = `
    this is to kindly inform you that we found a missing person from your database.
    The person's details are as follows:
    Name: ${person.name}
    Age: ${person.age}
    Gender: ${person.gender}
    Area of incidence: ${person.incidentPlace}
    Registration Date: ${person.registrationDate}
    Police Station: ${person.policeStation}
    District: ${person.district}

    We are informed by:
    Name: ${informer.name}
    phone: ${informer.phone}
    location: ${informer.location}
    `;

    return msg;
}

async function sendMailToPolice(policeEmail,informedInfo){
    const person = await missingPerson.find({_id : informedInfo.missingId});
    const informer = informedInfo.informer[Number(informedInfo.informer.length) - 1];

    await transporter.sendMail({
        from: '"Missing People Identification system 👻" <lalit5kondekar@gmail.com>', // sender address
        to: policeEmail, // list of receivers
        subject: `Missing person found: ${person[0].name}`, // Subject line
        text: informingMsg(person[0],informer),
    }); 

}

module.exports = {sendMailToPolice};