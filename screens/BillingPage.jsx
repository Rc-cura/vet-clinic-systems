import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, Linking as RNLinking, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
// 🟢 NEW: Import natin ang expo-linking
import * as Linking from 'expo-linking'; 

import { supabase } from '../context/supabase';
import { useUser } from '../context/UserContext';
import styles from '../styles/MyStyleSheet'; 

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
  return String(rawStatus || '').toLowerCase() === 'paid' ? 'Paid' : 'Pending Payment';
};

export default function BillingPage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useUser();

  // 🟢 NEW: Sasaluhin natin yung URL kapag bumalik sa app
  const incomingUrl = Linking.useURL(); 

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  // ================= 1. CATCH RETURN URL FROM PAYMONGO =================
  useEffect(() => {
    const handleSuccessUrl = async () => {
      if (incomingUrl) {
        // Basahin ang parameters sa URL na ibinato ni PayMongo pabalik
        const { queryParams } = Linking.parse(incomingUrl);

        if (queryParams && queryParams.payment_success === 'true' && queryParams.sale_id) {
          try {
            // I-update ang sales table to Paid
            await supabase.from('sales').update({ status: 'Paid' }).eq('id', queryParams.sale_id);
            
            // I-update din ang appointments table to Completed
            if (queryParams.apt_id && queryParams.apt_id !== 'undefined') {
                await supabase.from('appointments').update({ status: 'Completed' }).eq('id', queryParams.apt_id);
            }

            Alert.alert("Payment Successful", "Your invoice has been paid!");
            setSelectedInvoice(null);
            loadInvoices(); // Refresh the list
          } catch (err) {
            console.error("DB Update Error after payment:", err);
          }
        }
      }
    };

    handleSuccessUrl();
  }, [incomingUrl]);

  // ================= 2. FETCH INVOICES =================
  const loadInvoices = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data: salesData, error } = await supabase
        .from('sales')
        .select('*, appointments(pets(pet_name))')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedInvoices = (salesData || []).map((sale) => {
        const invoiceDate = sale.date ? new Date(sale.date) : new Date(sale.created_at);
        const dueDate = new Date(new Date(invoiceDate).setDate(invoiceDate.getDate() + 1));
        
        const amount = Number(sale.total_amount || 0);
        const status = toPaymentStatus(sale.status);
        const petName = sale.appointments?.pets?.pet_name || 'General Purchase';

        let parsedItems = [];
        if (sale.items) {
          parsedItems = typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;
        } else {
          parsedItems = [{ description: sale.type === 'product' ? 'Product Purchase' : 'Service Fee', price: amount }];
        }

        return {
          id: sale.id,
          appointmentId: sale.appointment_id,
          invoiceNumber: `INV-${String(sale.id || '').slice(-8).toUpperCase()}`,
          petName: petName,
          service: sale.type === 'appointment' ? 'Veterinary Service' : 'Clinic Purchase',
          date: invoiceDate,
          dueDate,
          amount,
          status,
          items: parsedItems,
          notes: sale.notes || ''
        };
      });

      setInvoices(mappedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadInvoices();
    }
  }, [isFocused, user]);

  // ================= 3. PAYMONGO PAYMENT FUNCTION =================
  const handlePayment = async (invoice) => {
    setIsPaying(true);
    try {
      // ⚠️ IMPORTANT: I-check kung tama pa rin ang IP address ng Next.js server mo
      const BACKEND_URL = 'http://10.254.127.9:3000'; 
      
      // 🟢 NEW: Gumawa ng deep link para sa app na ito
      const appReturnUrl = Linking.createURL('');

      const response = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: invoice.amount,
          description: `Payment for ${invoice.service} - ${invoice.petName}`,
          invoiceNumber: invoice.invoiceNumber,
          saleId: invoice.id, 
          appointmentId: invoice.appointmentId,
          returnUrl: appReturnUrl // 🟢 Ipapasa natin ito sa backend
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        RNLinking.openURL(data.checkoutUrl);
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

  // ================= 4. CALCULATIONS & FILTER =================
  const totalPaid = invoices.filter((inv) => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter((inv) => inv.status !== 'Paid').reduce((sum, inv) => sum + inv.amount, 0);

  const visibleInvoices = invoices.filter((invoice) => {
    let matchesFilter = true;
    if (filter === 'Paid') matchesFilter = invoice.status === 'Paid';
    if (filter === 'Pending') matchesFilter = invoice.status !== 'Paid';

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
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Billing & Invoices</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerCard}>
          <Text style={styles.bannerSubtitle}>BILLING CENTER</Text>
          <Text style={styles.bannerTitle}>Invoices & Payments</Text>
          <Text style={styles.bannerDesc}>Track paid and pending invoices generated from your appointments.</Text>
        </View>

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

        <View style={styles.mainSection}>
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

              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
                <Text style={styles.tableHeaderTextRight}>PRICE</Text>
              </View>
              
              <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={true}>
                {selectedInvoice?.items.map((item, idx) => (
                  <View key={idx} style={styles.tableRow}>
                    <Text style={styles.tableCellText}>{item.qty || 1}x {item.description}</Text>
                    <Text style={styles.tableCellTextRight}>{toCurrency(item.price * (item.qty || 1))}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.grandTotalBox}>
                <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                <Text style={styles.grandTotalValue}>{toCurrency(selectedInvoice?.amount)}</Text>
              </View>

              {/* Pay Now Button */}
              {selectedInvoice?.status !== 'Paid' && (
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