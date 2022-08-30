import { MongoClient} from 'mongodb'

// SERVER SIDE CODE
// /api/new-meetup

async function handler (req: any, res: any) {
    try {
        if (req.method === 'POST') {
            const data = req.body
    
            const client = await MongoClient.connect('mongodb://localhost:27017/NEXTJS')
            const db = client.db('NEXTJS')
    
            const meetupsCollection = db.collection('meetups')
    
            const result = await meetupsCollection.insertOne(data)
    
            console.log(result);

            client.close()

            res.status(201).json({message: 'Meetup insertada!'})
        }
    } catch (error) {
        console.log(error);
    }
}

export default handler