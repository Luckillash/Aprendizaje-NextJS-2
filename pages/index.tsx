import MeetupList from '../components/meetups/MeetupList'
import { MongoClient } from 'mongodb'
import Head from 'next/head'
import { Fragment } from 'react'

function HomePage(props: { meetups: [] }) {

    // const [loadedMeetups, setLoadedMeetups] = useState<any>([])

    // useEffect(() => {
    //     // HTTP
    //     setLoadedMeetups(DUMMY_MEETUPS)
    // }, [])

    return (
        <Fragment>
            <Head>
                <title>Next JS</title>
                <meta name='description' content='Contenido para ver en el SEO'/>
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
}

// export async function getServerSideProps(context: any) {
//     const req = context.req
//     const res = context.res
//     // Usar si se necesita acceso a req y res objects.
//     // Usar si se necesita data que cambia muchas veces y revalidate no es de mucha utilidad.
//     // Correrá siempre en el servidor después del deploy
//     // Fetch data de una API
//     // Corre siempre en el servidor, nunca en el cliente
//     // Corre por cada petición HTTPS
//     return {
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export async function getStaticProps() {
    // Permite pre-renderizar en vez de actualizar la data con el ciclo de useState y useEffect, 
    // haciéndola visible en la carta HTML y permitiendo que se vea en los search engine la información.
    // Fetch data de una API
    // Problema: outdated data, siempre va a tener la misma info
    // Revalidate la página será regenerada cada x seg en el server si hay peticiones https existentes,
    // la data nunca será más antigua que x seg. evita que se deba hacer re-deploy

    // fetch('/api/meetups') // redundante

    // Esto correrá cada vez que la página es pre-generada

    // Esto no se correrá en el cliente por ende no se mostrarán credenciales.

    const client = await MongoClient.connect('mongodb://localhost:27017/NEXTJS')
    const db = client.db('NEXTJS')

    const meetupsCollection = db.collection('meetups')

    const meetups = await meetupsCollection.find().toArray() // por default busca todos los documentos de la colección

    client.close()

    return { // siempre debe retornar un objeto
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString()
            }))
        },
        revalidate: 1
    }
}

export default HomePage 