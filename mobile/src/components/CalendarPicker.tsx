import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { CALENDARS, CALENDAR_GROUPS, VARIANT_LABELS } from '../engine/calendars';
import { T } from '../engine/i18n';

interface Props {
  value: string | null;
  onSelect: (calId: string) => void;
  label: string;
}

export function CalendarPicker({ value, onSelect, label }: Props) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const calName = value ? (T.calendars as any)[value] || value : '';

  const filtered = CALENDAR_GROUPS.map(g => {
    const lower = search.toLowerCase();
    const items = g.ids.filter(id => {
      const name = (T.calendars as any)[id] || id;
      return !lower || name.toLowerCase().includes(lower) || id.toLowerCase().includes(lower);
    });
    return items.length > 0 ? { group: g.group, items } : null;
  }).filter(Boolean) as { group: string; items: string[] }[];

  return (
    <View>
      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.picker, { borderColor: theme.colors.border, borderRadius: theme.borderRadius, backgroundColor: theme.colors.surface }]}
        onPress={() => { setVisible(true); setSearch(''); }}
      >
        <Text style={[styles.pickerText, { color: calName ? theme.colors.text : theme.colors.textMuted }]}>
          {calName || T.calendarPlaceholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{label}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={[styles.closeBtn, { color: theme.colors.accent }]}>Done</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.searchInput, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius }]}
            placeholder="Search..."
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
          <ScrollView style={styles.list}>
            {filtered.map(g => (
              <View key={g!.group}>
                <Text style={[styles.groupLabel, { color: theme.colors.textMuted }]}>
                  {(T.calendarGroups as any)[g!.group] || g!.group}
                </Text>
                {g!.items.map(id => (
                  <TouchableOpacity
                    key={id}
                    style={[styles.item, value === id && { backgroundColor: theme.colors.surfaceAlt }]}
                    onPress={() => { onSelect(id); setVisible(false); }}
                  >
                    <Text style={[styles.itemText, { color: theme.colors.text }]}>
                      {(T.calendars as any)[id] || id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  picker: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12 },
  pickerText: { fontSize: 16 },
  modal: { flex: 1, paddingTop: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  closeBtn: { fontSize: 17, fontWeight: '600' },
  searchInput: { marginHorizontal: 16, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 8 },
  list: { flex: 1 },
  groupLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  item: { paddingHorizontal: 16, paddingVertical: 12 },
  itemText: { fontSize: 16 },
});
