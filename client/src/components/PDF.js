import {Document, Page, Text, View, StyleSheet, Font} from "@react-pdf/renderer";
import React, {useEffect} from "react";

Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
});

const styles = StyleSheet.create({
    page: {
        display: 'flex',
        backgroundColor: '#fff'
    },
    text: {
        fontFamily: 'Roboto'
    }
});

const PDF = () => {
    const [data, setData] = React.useState({
        name: '',
        phone: ''
    })
    useEffect(() => {
        const local = localStorage.getItem('data')
        setData(JSON.parse(local))
    }, [])


    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={styles.section}>
                    <Text style={styles.text}>Name: {data.name}</Text>
                </View>

            </Page>
        </Document>
    )
}
export default PDF;