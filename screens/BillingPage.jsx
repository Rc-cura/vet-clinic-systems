import React, { useState, useEffect, useMemo } from 'react';
// 🟢 Idinagdag ang Linking at Alert
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, StyleSheet, Linking, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';
import MyStyleSheet from '../styles/MyStyleSheet'; 

// ================= HELPER FUNCTIONS =================
const toCurrency = (value) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
};

const toDateLabel = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const toPaymentStatus = (rawStatus) => {
  return String(rawStatus || '').toLowerCase() === 'completed' ? 'Paid' : 'Pending';
};

export default function BillingPage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // 🟢 BAGONG STATE PARA SA PAYMENT
  const [isPaying, setIsPaying] = useState(false);

  // ================= 1. FETCH INVOICES =================
  useEffect(() => {
    async function loadInvoices() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const { data: appointments, error } = await supabase
          .from('appointments')
          .select('id, appointment_date, service_type, status, pets(pet_name)')
          .eq('client_id', user.id)
          .neq('status', 'Cancelled')
          .order('appointment_date', { ascending: false });

        if (error) throw error;

        const mappedInvoices = (appointments || []).map((appointment) => {
          const appointmentDate = appointment.appointment_date ? new Date(appointment.appointment_date) : null;
          const dueDate = appointmentDate
            ? new Date(new Date(appointmentDate).setDate(appointmentDate.getDate() + 1))
            : null;

          const amount = Number(appointment.total_amount || 1000); 
          const status = toPaymentStatus(appointment.status);

          return {
            id: appointment.id,
            invoiceNumber: `INV-${String(appointment.id || '').slice(0, 8).toUpperCase()}`,
            petName: appointment.pets?.pet_name || 'Unknown pet',
            service: appointment.service_type || 'Consultation',
            date: appointmentDate,
            dueDate,
            amount,
            status,
            items: [
              { description: appointment.service_type || 'Consultation service', price: amount / 2 },
              { description: 'Clinic consultation fee', price: amount / 2 },
            ],
          };
        });

        setInvoices(mappedInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isFocused) {
      loadInvoices();
    }
  }, [isFocused, user]);

  // ================= 2. PAYMONGO PAYMENT FUNCTION =================
  // 🟢 BAGONG FUNCTION PARA SA PAYMONGO
  const handlePayment = async (invoice) => {
    setIsPaying(true);
    try {
      // ⚠️ IMPORTANT: Palitan ito ng totoong IPv4 Address ng PC mo kung saan naka-run ang Next.js!
      // Halimbawa: 'http://192.168.1.45:3000'
      const BACKEND_URL = 'http://10.254.127.9:3000';

      const response = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: invoice.amount,
          description: `Payment for ${invoice.service} - ${invoice.petName}`,
          invoiceNumber: invoice.invoiceNumber,
          appointmentId: invoice.id 
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Ito ang magbubukas ng browser papunta sa PayMongo
        Linking.openURL(data.checkoutUrl);
      } else {
        Alert.alert('Payment Failed', data.error || 'Could not generate payment link.');
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert('Connection Error', 'Make sure your Next.js server is running and the BACKEND_URL IP address is correct.');
    } finally {
      setIsPaying(false);
    }
  };

  // ================= 3. CALCULATIONS =================
  const totalPaid = invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter((inv) => inv.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);

  const visibleInvoices = invoices.filter((invoice) => {
    const matchesFilter = filter === 'All' || invoice.status === filter;
    if (!matchesFilter) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      invoice.invoiceNumber.toLowerCase().includes(q) ||
      invoice.petName.toLowerCase().includes(q) ||
      invoice.service.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing & Invoices</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Banner */}
        <View style={styles.bannerCard}>
          <Text style={styles.bannerSubtitle}>BILLING CENTER</Text>
          <Text style={styles.bannerTitle}>Invoices & Payments</Text>
          <Text style={styles.bannerDesc}>Track paid and pending invoices generated from your appointments.</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Total Paid</Text>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{toCurrency(totalPaid)}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Pending Balance</Text>
              <Feather name="clock" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{toCurrency(totalPending)}</Text>
          </View>
        </View>

        {/* Main Section */}
        <View style={styles.mainSection}>
          
          {/* Filters */}
          <View style={styles.filterRow}>
            {['All', 'Paid', 'Pending'].map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setFilter(status)}
                style={[styles.filterBtn, filter === status && styles.filterBtnActive]}
              >
                <Text style={[styles.filterBtnText, filter === status && styles.filterBtnTextActive]}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search invoice, pet, or service"
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Invoices List */}
          {loading ? (
            <ActivityIndicator size="large" color="#2E3A91" style={{ marginTop: 40 }} />
          ) : visibleInvoices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No invoices found.</Text>
            </View>
          ) : (
            visibleInvoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceCard}>
                
                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceCol}>
                    <Text style={styles.invoiceLabel}>INVOICE</Text>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                  </View>
                  <View style={styles.invoiceCol}>
                    <Text style={styles.invoiceLabel}>PET / SERVICE</Text>
                    <Text style={styles.invoiceTextStrong}>{invoice.petName}</Text>
                    <Text style={styles.invoiceTextSub}>{invoice.service}</Text>
                  </View>
                </View>

                <View style={styles.invoiceRow}>
                  <View style={styles.invoiceCol}>
                    <Text style={styles.invoiceLabel}>DATES</Text>
                    <Text style={styles.invoiceTextSub}>Issued: {toDateLabel(invoice.date)}</Text>
                    <Text style={styles.invoiceTextSub}>Due: {toDateLabel(invoice.dueDate)}</Text>
                  </View>
                  <View style={styles.invoiceCol}>
                    <Text style={styles.invoiceLabel}>AMOUNT</Text>
                    <Text style={styles.invoiceAmount}>{toCurrency(invoice.amount)}</Text>
                  </View>
                </View>

                <View style={styles.invoiceFooter}>
                  <View style={[styles.statusBadge, invoice.status === 'Paid' ? styles.statusPaid : styles.statusPending]}>
                    <Text style={[styles.statusText, invoice.status === 'Paid' ? styles.statusTextPaid : styles.statusTextPending]}>
                      {invoice.status}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => setSelectedInvoice(invoice)}>
                    <Text style={styles.viewBtnText}>View Details</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Invoice Details Modal */}
      <Modal visible={!!selectedInvoice} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.invoiceLabel}>INVOICE</Text>
                <Text style={styles.modalTitle}>{selectedInvoice?.invoiceNumber}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedInvoice(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalGrid}>
                <View style={styles.modalGridCol}>
                  <Text style={styles.invoiceLabel}>PET</Text>
                  <Text style={styles.modalGridText}>{selectedInvoice?.petName}</Text>
                </View>
                <View style={styles.modalGridCol}>
                  <Text style={styles.invoiceLabel}>SERVICE</Text>
                  <Text style={styles.modalGridText}>{selectedInvoice?.service}</Text>
                </View>
                <View style={styles.modalGridCol}>
                  <Text style={styles.invoiceLabel}>ISSUE DATE</Text>
                  <Text style={styles.modalGridText}>{toDateLabel(selectedInvoice?.date)}</Text>
                </View>
                <View style={styles.modalGridCol}>
                  <Text style={styles.invoiceLabel}>DUE DATE</Text>
                  <Text style={styles.modalGridText}>{toDateLabel(selectedInvoice?.dueDate)}</Text>
                </View>
              </View>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
                <Text style={styles.tableHeaderTextRight}>PRICE</Text>
              </View>
              
              {/* Table Body */}
              {selectedInvoice?.items.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={styles.tableCellText}>{item.description}</Text>
                  <Text style={styles.tableCellTextRight}>{toCurrency(item.price)}</Text>
                </View>
              ))}

              <View style={styles.grandTotalBox}>
                <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                <Text style={styles.grandTotalValue}>{toCurrency(selectedInvoice?.amount)}</Text>
              </View>

              {/* 🟢 NA-UPDATE NA PAY NOW BUTTON */}
              {selectedInvoice?.status === 'Pending' && (
                <TouchableOpacity 
                  style={[styles.payBtn, isPaying && { opacity: 0.7 }]} 
                  onPress={() => handlePayment(selectedInvoice)}
                  disabled={isPaying}
                >
                  {isPaying ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="card" size={20} color="#FFF" style={{marginRight: 8}} />
                      <Text style={styles.payBtnText}>Pay securely with PayMongo</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn: { padding: 5 },
  backBtnText: { fontSize: 28, color: '#2E3A91' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  content: { padding: 20 },

  bannerCard: { backgroundColor: '#2E3A91', borderRadius: 25, padding: 25, marginBottom: 20 },
  bannerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
  bannerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  bannerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 10, lineHeight: 18 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 10, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#2E3A91' },

  mainSection: { backgroundColor: '#FFF', borderRadius: 25, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  
  filterRow: { flexDirection: 'row', marginBottom: 15 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 10 },
  filterBtnActive: { backgroundColor: '#2E3A91' },
  filterBtnText: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  filterBtnTextActive: { color: '#FFF' },

  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 15, paddingHorizontal: 15, height: 45, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },

  emptyState: { padding: 30, alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 15 },
  emptyText: { color: '#94A3B8', fontSize: 14 },

  invoiceCard: { backgroundColor: '#F8FAFC', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#E2E8F0' },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  invoiceCol: { flex: 1 },
  invoiceLabel: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  invoiceNumber: { fontSize: 14, fontWeight: 'bold', color: '#2E3A91' },
  invoiceTextStrong: { fontSize: 14, fontWeight: 'bold', color: '#2E3A91' },
  invoiceTextSub: { fontSize: 12, color: '#64748B' },
  invoiceAmount: { fontSize: 18, fontWeight: 'bold', color: '#2E3A91' },

  invoiceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 15 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  statusPaid: { backgroundColor: '#D1FAE5' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  statusTextPaid: { color: '#047857' },
  statusTextPending: { color: '#B45309' },
  
  viewBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  viewBtnText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2E3A91' },
  closeBtn: { backgroundColor: '#F1F5F9', padding: 8, borderRadius: 15 },
  modalBody: { padding: 25 },
  
  modalGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  modalGridCol: { width: '50%', marginBottom: 15 },
  modalGridText: { fontSize: 14, fontWeight: 'bold', color: '#1E293B', marginTop: 2 },

  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, marginBottom: 10 },
  tableHeaderText: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8' },
  tableHeaderTextRight: { fontSize: 10, fontWeight: 'bold', color: '#94A3B8', textAlign: 'right' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCellText: { fontSize: 13, color: '#475569', flex: 1 },
  tableCellTextRight: { fontSize: 13, fontWeight: 'bold', color: '#1E293B', textAlign: 'right' },

  grandTotalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEF2FF', padding: 15, borderRadius: 15, marginTop: 20 },
  grandTotalLabel: { fontSize: 12, fontWeight: 'bold', color: '#2E3A91' },
  grandTotalValue: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },

  payBtn: { flexDirection: 'row', backgroundColor: '#2E3A91', padding: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});