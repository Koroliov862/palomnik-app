import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface FilterOptions {
  denominationIds: number[]; // список выбранных ID конфессий
  hasWheelchair: boolean;
  hasParking: boolean;
  isOpen247: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  denominations: { id: number; name: string }[]; // список конфессий из API
  initialFilters?: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, denominations, initialFilters }) => {
  const [selectedDenoms, setSelectedDenoms] = useState<number[]>(initialFilters?.denominationIds || []);
  const [wheelchair, setWheelchair] = useState(initialFilters?.hasWheelchair || false);
  const [parking, setParking] = useState(initialFilters?.hasParking || false);
  const [open247, setOpen247] = useState(initialFilters?.isOpen247 || false);

  const toggleDenom = (id: number) => {
    setSelectedDenoms(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedDenoms([]);
    setWheelchair(false);
    setParking(false);
    setOpen247(false);
  };

  const apply = () => {
    onApply({
      denominationIds: selectedDenoms,
      hasWheelchair: wheelchair,
      hasParking: parking,
      isOpen247: open247,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Фильтры</Text>
          <ScrollView>
            <Text style={styles.sectionTitle}>Конфессии</Text>
            {denominations.map(denom => (
              <TouchableOpacity key={denom.id} style={styles.checkboxRow} onPress={() => toggleDenom(denom.id)}>
                <View style={[styles.checkbox, selectedDenoms.includes(denom.id) && styles.checkboxChecked]} />
                <Text style={styles.label}>{denom.name}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>Доступность</Text>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setWheelchair(!wheelchair)}>
              <View style={[styles.checkbox, wheelchair && styles.checkboxChecked]} />
              <Text style={styles.label}>Пандус</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setParking(!parking)}>
              <View style={[styles.checkbox, parking && styles.checkboxChecked]} />
              <Text style={styles.label}>Парковка</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Режим работы</Text>
            <TouchableOpacity style={styles.checkboxRow} onPress={() => setOpen247(!open247)}>
              <View style={[styles.checkbox, open247 && styles.checkboxChecked]} />
              <Text style={styles.label}>Круглосуточно</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetText}>Сбросить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={apply}>
              <Text style={styles.applyText}>Применить</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#C17B5E',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#C17B5E',
  },
  label: {
    fontSize: 16,
    color: '#3A2C1F',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#EFEBE4',
    padding: 12,
    borderRadius: 30,
    marginRight: 8,
    alignItems: 'center',
  },
  resetText: {
    color: '#6B6A66',
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#C17B5E',
    padding: 12,
    borderRadius: 30,
    marginLeft: 8,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: '500',
  },
  closeButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#6B6A66',
  },
});

export default FilterModal;