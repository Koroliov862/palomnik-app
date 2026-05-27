 import {StyleSheet, View, Text} from "react-native";
 
 const HeroCard = () => {
    return(
        <View style = {styles.heroinfo}>
            <Text style = {styles.hero}> Упырь </Text>
            <Text style = {styles.level}> Уровень: 1 </Text>
        </View>
    );
 };

 export default HeroCard;

 const styles = StyleSheet.create({
    heroinfo:{
        backgroundColor:"#ff0000ff",
        padding:20, //внутренние отступы от элемента
        borderRadius:16, //скругление на 16 пикселей по бокам
    },
    hero:{
        color:"white", //цвет текста
        fontSize:20, //размер текста
        fontWeight:800, //жирность текста
    },
    level:{
        color:"white", //цвет текста
        fontSize:20, //размер текста
    }
 })