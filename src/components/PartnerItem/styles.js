import { StyleSheet, Dimensions } from 'react-native';
import { BaseColor } from '@config';

export default StyleSheet.create({
    partnerDateBadge: {
        backgroundColor: BaseColor.textPrimaryColor,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    partnerDescriptionBadge: {
        marginLeft: 6,
        backgroundColor: BaseColor.textPrimaryColor,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    partnerImg: {
        width: Dimensions.get('window').width - 40,
        height: 190,
        borderRadius: 10,
    },
    partnerImgBackground: {
        width: Dimensions.get('window').width - 40,
        height: 190,
    },
});
