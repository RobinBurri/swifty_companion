import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { GlobalStyles } from '../../constants/styles'
import BasicStudent from '../../models/BasicStudent'

type RootStackParamList = {
    Detail: { studentId: number }
}

type NavigationProps = NavigationProp<RootStackParamList>

export default function StudentItem({
    student: student,
}: {
    student: BasicStudent
}) {
    const navigation = useNavigation<NavigationProps>()
    const onSelectStudent = () => {
        navigation.navigate('Detail', { studentId: student.getId() })
    }
    const imageResource = student.getPicture()

    if (!imageResource) {
        return (
            <Pressable onPress={onSelectStudent}>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/anonyme.jpeg')}
                        style={styles.image}
                    />
                    <Text style={styles.text}>{student.getLogin()}</Text>
                </View>
            </Pressable>
        )
    }
    return (
        <Pressable onPress={onSelectStudent}>
            <View style={styles.container}>
                <Image source={{ uri: imageResource }} style={styles.image} />
                <Text style={styles.text}>{student.getLogin()}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
        padding: 10,
        borderColor: GlobalStyles.colors.darkGreen,
        backgroundColor: GlobalStyles.colors.darkGreen,
        borderWidth: 1,
        borderRadius: GlobalStyles.card.borderRadius,
        width: '95%',
        marginBottom: 10,
        elevation: 5,
        shadowColor: GlobalStyles.colors.darkBrown,
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    text: {
        fontSize: 20,
        color: GlobalStyles.colors.beige,
    },
})
