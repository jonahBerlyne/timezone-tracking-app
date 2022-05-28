import TimeZone from "../User/Team/TimeZone";
import "../Styles/Home.css";

export default function Home() {

 const dummyDataOne = {
  offset: -7,
  members: [
   {
    id: "jnngvnvkg",
    name: "Mark",
    profilePic: "/Images/default_pic.png",
    timezoneData: {
     countryCode: "US",
     countryName: "United States of America",
     gmtOffset: -25200,
     timestamp: 92309302,
     utcOffset: -7,
     zoneName: "America/Los_Angeles",
    }
   }
  ]
 };

 const dummyDataTwo = {
  offset: -4,
  members: [
   {
    id: "jcnjknjnkjfc",
    name: "Trent",
    profilePic: "/Images/default_pic.png",
    timezoneData: {
     countryCode: "US",
     countryName: "United States of America",
     gmtOffset: -14400,
     timestamp: 71827811,
     utcOffset: -4,
     zoneName: "America/New_York",
    }
   },
   {
    id: "cnfjkjcfk",
    name: "Melinda",
    profilePic: "/Images/default_pic.png",
    timezoneData: {
     countryCode: "US",
     countryName: "United States of America",
     gmtOffset: -14400,
     timestamp: 89238923,
     utcOffset: -4,
     zoneName: "America/New_York",
    }
   }
  ]
 };

 const dummyDataThree = {
  offset: 1,
  members: [
   {
    id: "jkmkvgkmkvg",
    name: "Jacob",
    profilePic: "/Images/default_pic.png",
    timezoneData: {
     countryCode: "GB",
     countryName: "United Kingdom of Great Britain and Northern Ireland",
     gmtOffset: 3600,
     timestamp: 98328931,
     utcOffset: 1,
     zoneName: "Europe/London",
    }
   }
  ]
 };

 return (
  <div className="home-page-container">

   <div className="home-page-top">
    <h3>Keep track where and <em>when</em> your team is.</h3>
    <div className="dummy-team-container">
     <TimeZone offset={dummyDataOne.offset} members={dummyDataOne.members} />
     <TimeZone offset={dummyDataTwo.offset} members={dummyDataTwo.members} />
     <TimeZone offset={dummyDataThree.offset} members={dummyDataThree.members} />
    </div>
   </div>

   <div className="home-page-middle">
    <p>Easily plan meetings + calls with your remote, nomadic team without having to Google</p>
    <input type="text" placeholder="time in London" readOnly />
    <p><em>...ever again.</em></p>
   </div>

   <div className="home-page-bottom">
    <p>Modern global teams have awesome people spread across multiple timezones. Lots of teams have <em>digital nomads</em> changing locations faster than we can keep up with. Often it gets tricky to remember what time it is where your teammates are. Thanks to the timezone tracking app, now you can!</p>
   </div>

  </div>
 );
}