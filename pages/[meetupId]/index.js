import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from 'next/head';
const MeetupDetails = (props) => {
  return (
    <Fragment>
        <Head>
            <title>{props.meetupData.title}</title>
            <meta name = "description" content={props.meetupData.description}/>
        </Head>
        <MeetupDetail
            image = {props.meetupData.image}
            title = {props.meetupData.title}
            address = {props.meetupData.address}
            description = {props.meetupData.description}
        />
    </Fragment>
  );
};
export async function getStaticPaths(){
    const client = await MongoClient.connect(process.env.DB_URL);


    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const meetups = await meetupsCollection.find({}, {_id : 1}).toArray();

    client.close();

    return {
        fallback : 'blocking',
        paths : meetups.map((meetup) => {
            return {
                params : {
                    meetupId : meetup._id.toString()
                }
            }
        }) 
    }
}
export async function getStaticProps(context) {
    // fetch data from API
    const meetupId = context.params.meetupId;
    const client = await MongoClient.connect("mongodb+srv://madanNext:madanNext@cluster0.yhleb.mongodb.net/meetups?retryWrites=true&w=majority");


    const db = client.db();

    const meetupsCollection = db.collection('meetups');

    const selectedMeetup = await meetupsCollection.findOne({_id : ObjectId(meetupId)});

    client.close();
    return {
        props : {
            meetupData : {
                id : selectedMeetup._id.toString(),
                title : selectedMeetup.title,
                image : selectedMeetup.image,
                address : selectedMeetup.address,
                description : selectedMeetup.description,

            }
        }
    }
}
export default MeetupDetails;
