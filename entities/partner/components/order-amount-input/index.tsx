import { View, Text } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

import { formatNumber } from '@/utils/number';
import { Separator } from '@/components/separator';
import Button from '@/components/button';

import OrderCounter from '../order-counter';
import { Partner } from '../../types';
import styles from './styles';

interface BoxOption {
  id: string;
  name: string;
  price: number;
  description: string;
  popular?: boolean;
}

export interface OrderAmountInputProps {
  partner: Partner;
  selectedOption?: BoxOption;
}

export default function OrderAmountInput({ partner, selectedOption }: OrderAmountInputProps) {
  const [boxAmount, setBoxAmount] = useState(1);
  const availableBoxes = partner.totalBoxCount;
  const price = selectedOption?.price || partner.price;

  function proceed() {
    // Pass the selected box option and quantity to the checkout page using path segments
    router.push({
      pathname: `/partners/${partner.id}/checkout`,
      params: {
        boxType: selectedOption?.id || 'standard',
        boxName: selectedOption?.name || 'Стандартный',
        boxPrice: price.toString(),
        boxQuantity: boxAmount.toString(),
        boxDescription: selectedOption?.description || ''
      }
    } as any); // Type assertion to work around router typing limitations
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Koличecтвo боксов</Text>
      <Separator spacing={24} />
      <OrderCounter
        min={1}
        max={availableBoxes}
        onChange={(num) => setBoxAmount(num)}
      />
      <Text style={styles.available}>Доступно: {availableBoxes}</Text>
      <Separator spacing={24} />
      <Button onPress={proceed} disabled={availableBoxes <= 0}>
        <Text style={styles.btn}>
          К оплате {formatNumber(boxAmount * price, { suffix: "₸" })}
        </Text>
      </Button>
    </View>
  );
}
