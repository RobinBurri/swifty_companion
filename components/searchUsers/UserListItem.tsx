import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { GlobalStyles } from '../../constants/styles'
import BasicUser from '../../models/BasicUser'

export default function UserListItem({ item: user }: { item: BasicUser }) {
    return (
        <Pressable onPress={() => {}}>
            <View style={styles.container}>
                <Image
                    source={{ uri: user.getPicture() }}
                    style={styles.image}
                />
                <Text style={styles.text}>{user.getLogin()}</Text>
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
        elevation: 3,
        shadowColor: GlobalStyles.colors.darkBrown,
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
 
    },
    text: {
        color: GlobalStyles.colors.beige,
        fontSize: 20,
    },
})
