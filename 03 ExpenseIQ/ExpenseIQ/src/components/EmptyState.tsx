import React from 'react';

import {
    Text,
    View,
} from 'react-native';

interface Props {
    title: string;
}

const EmptyState = ({
    title,
}: Props) => {
    return (
        <View
            style={{
                marginTop: 100,
                alignItems:
                    'center',
            }}
        >
            <Text
                style={{
                    fontSize: 50,
                }}
            >
                📭
            </Text>

            <Text
                style={{
                    marginTop: 10,
                    fontSize: 16,
                }}
            >
                {title}
            </Text>
        </View>
    );
};

export default EmptyState;