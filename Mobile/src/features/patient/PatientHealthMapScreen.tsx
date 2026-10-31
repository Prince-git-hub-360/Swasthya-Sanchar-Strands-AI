import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  Activity,
  Heart,
  Brain,
  Wind,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  X,
  MessageSquare,
  FileText,
  MapPin,
  Navigation,
  PhoneCall,
  Phone,
  Building2,
  Pill,
  HeartPulse,
  Clock,
  Compass,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_ORGANS, OrganDetail } from '../../mock/healthData';
import { VoiceAssistantService } from '../../services/speechService';
import { useAppSafeArea } from '../../hooks/useAppSafeArea';

export interface RuralFacility {
  id: string;
  name: string;
  nameHindi: string;
  type: 'PHC' | 'HOSPITAL' | 'PHARMACY' | 'AMBULANCE' | 'ASHA';
  distance: string;
  eta: string;
  phone: string;
  address: string;
  addressHindi: string;
  services: string[];
  status: string;
  lat: number;
  lng: number;
  icon: string;
  doctorOnDuty: string;
  bedsAvailable: string;
  stockStatus: string;
}

const RURAL_FACILITIES: RuralFacility[] = [
  {
    id: 'f1',
    name: 'Rampur Primary Health Centre (PHC)',
    nameHindi: 'रामपूर प्राथमिक स्वास्थ्य केंद्र (PHC)',
    type: 'PHC',
    distance: '0.8 km',
    eta: '4 mins walk',
    phone: '+919415012345',
    address: 'Main Road, Rampur Gram, Ward 3',
    addressHindi: 'मुख्य मार्ग, रामपुर ग्राम, वार्ड ३',
    services: ['24x7 Emergency', 'Anti-Snake Venom (ASV)', 'Maternity Ward', 'Free Generic Meds'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3176,
    lng: 82.9739,
    icon: '🩺',
    doctorOnDuty: 'Dr. Ramesh Sharma (MBBS, DCH)',
    bedsAvailable: '12 / 16 Beds Available',
    stockStatus: 'Generic Medicine Stock: 98%',
  },
  {
    id: 'f2',
    name: 'Varanasi District Hospital & Trauma Centre',
    nameHindi: 'वाराणसी जिला अस्पताल एवं ट्रॉमा सेंटर',
    type: 'HOSPITAL',
    distance: '2.1 km',
    eta: '8 mins by vehicle',
    phone: '+915422221111',
    address: 'Kabir Chaura, Varanasi District',
    addressHindi: 'कबीर चौरा, वाराणसी जिला',
    services: ['ICU & CCU', 'Blood Bank', 'Advanced Trauma Care', '24x7 Ambulance'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3210,
    lng: 82.9850,
    icon: '🏥',
    doctorOnDuty: 'Dr. Ananya Verma (Chief Surgeon)',
    bedsAvailable: '45 / 120 Beds Available',
    stockStatus: 'Blood Bank: All Groups Active',
  },
  {
    id: 'f3',
    name: 'Pradhan Mantri Jan Aushadhi 24x7 Kendra',
    nameHindi: 'प्रधानमंत्री जन औषधि 24x7 केंद्र',
    type: 'PHARMACY',
    distance: '1.2 km',
    eta: '5 mins',
    phone: '+919838098765',
    address: 'Shop 4, Gram Panchayat Market, Rampur',
    addressHindi: 'दुकान नं ४, ग्राम पंचायत बाजार, रामपुर',
    services: ['Generic Medicines 90% Off', 'Oxygen Cylinders', 'First-Aid Kits', 'Glucometer Strips'],
    status: 'Open 24 Hours (खुला है)',
    lat: 25.3150,
    lng: 82.9700,
    icon: '💊',
    doctorOnDuty: 'Pharmacist: Rajesh Patel (B.Pharm)',
    bedsAvailable: 'N/A (Pharmacy & Supplies)',
    stockStatus: '500+ Essential Generics in Stock',
  },
  {
    id: 'f4',
    name: '108 Rural Ambulance Dispatch Unit #4',
    nameHindi: '१०८ ग्रामीण एम्बुलेंस डिस्पैच यूनिट #४',
    type: 'AMBULANCE',
    distance: '1.0 km',
    eta: '7 mins ETA',
    phone: '108',
    address: 'Stationed at Rampur Crossing, Sector 2',
    addressHindi: 'रामपुर चौराहा, सेक्टर २',
    services: ['Advanced Life Support (ALS)', 'Paramedic on Board', 'Oxygen & Defibrillator'],
    status: 'Active on Standby (तैयार है)',
    lat: 25.3190,
    lng: 82.9760,
    icon: '🚑',
    doctorOnDuty: 'EMT: Suresh Kumar (Paramedic)',
    bedsAvailable: '1 Stretcher + 1 Mobile ICU Unit',
    stockStatus: 'Emergency O2 Cylinder Full',
  },
  {
    id: 'f5',
    name: 'ASHA Didi Community Outpost (Sunita Bai)',
    nameHindi: 'आशा दीदी स्वास्थ्य सहायता केंद्र (सुनीता बाई)',
    type: 'ASHA',
    distance: '0.3 km',
    eta: '2 mins walk',
    phone: '+919450098123',
    address: 'Anganwadi Centre 2, Rampur Gram',
    addressHindi: 'आंगनवाड़ी केंद्र २, रामपुर ग्राम',
    services: ['Doorstep BP & Sugar Check', 'Maternal Counseling', 'Free ORS & Iron Pills', 'ABHA Card Assistance'],
    status: 'Active Field Duty (ड्यूटी पर उपस्थित)',
    lat: 25.3170,
    lng: 82.9730,
    icon: '👩‍⚕️',
    doctorOnDuty: 'ASHA Worker: Sunita Bai',
    bedsAvailable: 'First Aid Kit & Digital Testing Kit',
    stockStatus: 'ORS, Zinc, Folic Acid Available',
  },
];

export const PatientHealthMapScreen: React.FC = () => {
  const insets = useAppSafeArea();
  const { currentLanguage } = useLanguage();

  // Top Mode Switcher: 'FACILITIES' (Geographic Map) | 'ANATOMY' (3D Organ Explorer)
  const [activeScreenTab, setActiveScreenTab] = useState<'FACILITIES' | 'ANATOMY'>('FACILITIES');

  // Facilities Tab States
  const [facilityCategory, setFacilityCategory] = useState<string>('ALL');
  const [selectedFacility, setSelectedFacility] = useState<RuralFacility | null>(null);

  // Anatomy Tab States
  const [selectedView, setSelectedView] = useState<'FRONT' | 'SIDE' | 'BACK'>('FRONT');
  const [selectedOrganKey, setSelectedOrganKey] = useState<string>('heart');
  const [organModalVisible, setOrganModalVisible] = useState<boolean>(false);

  const organKeys = Object.keys(MOCK_ORGANS);
  const currentOrgan: OrganDetail = MOCK_ORGANS[selectedOrganKey] || MOCK_ORGANS.heart;

  const handleSelectOrgan = (key: string) => {
    setSelectedOrganKey(key);
  };

  const handleOpenOrganDetails = (key: string) => {
    setSelectedOrganKey(key);
    setOrganModalVisible(true);
  };

  const handleOpenDirections = (facility: RuralFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Directions', `Navigating to ${facility.name} (${facility.distance})`);
    });
  };

  const handleCallFacility = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert('Calling Facility', `Dialing ${name}: ${phone}`);
    });
  };

  const filteredFacilities =
    facilityCategory === 'ALL'
      ? RURAL_FACILITIES
      : RURAL_FACILITIES.filter((f) => f.type === facilityCategory);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Mode Dual Tab Switcher */}
        <View style={styles.mainModeContainer}>
          <TouchableOpacity
            style={[styles.mainModeTab, activeScreenTab === 'FACILITIES' && styles.mainModeTabActive]}
            onPress={() => setActiveScreenTab('FACILITIES')}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={activeScreenTab === 'FACILITIES' ? '#FFFFFF' : COLORS.textSecondary} />
            <Text style={[styles.mainModeTabText, activeScreenTab === 'FACILITIES' && styles.mainModeTabTextActive]}>
              Nearby Health Centres
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mainModeTab, activeScreenTab === 'ANATOMY' && styles.mainModeTabActive]}
            onPress={() => setActiveScreenTab('ANATOMY')}
            activeOpacity={0.8}
          >
            <Activity size={16} color={activeScreenTab === 'ANATOMY' ? '#FFFFFF' : COLORS.textSecondary} />
            <Text style={[styles.mainModeTabText, activeScreenTab === 'ANATOMY' && styles.mainModeTabTextActive]}>
              Body & Organs Guide
            </Text>
          </TouchableOpacity>
        </View>

        {activeScreenTab === 'FACILITIES' ? (
          /* ========================================================= */
          /* MODE 1: GEOGRAPHIC RURAL HEALTH MAP & FACILITY LOCATOR    */
          /* ========================================================= */
          <View>
            {/* Header Title */}
            <View style={styles.header}>
              <Text style={styles.screenTitle}>Rural Health Map / स्वास्थ्य केंद्र</Text>
              <Text style={styles.screenSubtitle}>
                GPS-enabled locator for PHCs, Jan Aushadhi generic chemists, ambulances & ASHA outposts
              </Text>
            </View>

            {/* GPS Location & Live Radar Banner */}
            <View style={styles.gpsBanner}>
              <View style={styles.gpsLeft}>
                <View style={styles.gpsPulseDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gpsTitle}>
                    📍 Rampur Gram, Ward 3 (रामपुर ग्राम, वार्ड ३)
                  </Text>
                  <Text style={styles.gpsSub}>
                    GPS Accuracy: 98% • Lat 25.3176° N, Long 82.9739° E
                  </Text>
                </View>
              </View>
              <View style={styles.gpsBadge}>
                <Text style={styles.gpsBadgeText}>LIVE GPS</Text>
              </View>
            </View>

            {/* Interactive Visual Radar Map Canvas */}
            <View style={styles.mapCanvasCard}>
              <View style={styles.mapCanvasHeader}>
                <View style={styles.mapCanvasTitleRow}>
                  <Compass size={16} color="#10B981" />
                  <Text style={styles.mapCanvasTitle}>Rural Area Radar Map (नक्शा)</Text>
                </View>
                <Text style={styles.mapRadiusIndicator}>Radius: 2.5 km</Text>
              </View>

              {/* Graphic Radar Simulation */}
              <View style={styles.radarVisualStage}>
                {/* Concentric distance circles */}
                <View style={[styles.radarRing, { width: 220, height: 220 }]} />
                <View style={[styles.radarRing, { width: 150, height: 150 }]} />
                <View style={[styles.radarRing, { width: 80, height: 80 }]} />

                {/* Crosshairs */}
                <View style={styles.radarCrosshairV} />
                <View style={styles.radarCrosshairH} />

                {/* User Center Pin */}
                <View style={styles.userCenterPin}>
                  <View style={styles.userCenterPulse} />
                  <View style={styles.userCenterDot} />
                </View>
                <Text style={styles.userPinLabel}>You / आप</Text>

                {/* Interactive Facility Pins */}
                {/* Rampur PHC */}
                <TouchableOpacity
                  style={[styles.facilityPin, { top: 35, left: '60%' }]}
                  onPress={() => setSelectedFacility(RURAL_FACILITIES[0])}
                >
                  <Text style={styles.pinEmoji}>🩺</Text>
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinBubbleText}>PHC 0.8km</Text>
                  </View>
                </TouchableOpacity>

                {/* ASHA Outpost */}
                <TouchableOpacity
                  style={[styles.facilityPin, { top: 75, left: '28%' }]}
                  onPress={() => setSelectedFacility(RURAL_FACILITIES[4])}
                >
                  <Text style={styles.pinEmoji}>👩‍⚕️</Text>
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinBubbleText}>ASHA 0.3km</Text>
                  </View>
                </TouchableOpacity>

                {/* Jan Aushadhi */}
                <TouchableOpacity
                  style={[styles.facilityPin, { top: 125, right: '18%' }]}
                  onPress={() => setSelectedFacility(RURAL_FACILITIES[2])}
                >
                  <Text style={styles.pinEmoji}>💊</Text>
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinBubbleText}>Meds 1.2km</Text>
                  </View>
                </TouchableOpacity>

                {/* 108 Ambulance */}
                <TouchableOpacity
                  style={[styles.facilityPin, { bottom: 45, left: '38%' }]}
                  onPress={() => setSelectedFacility(RURAL_FACILITIES[3])}
                >
                  <Text style={styles.pinEmoji}>🚑</Text>
                  <View style={styles.pinBubble}>
                    <Text style={styles.pinBubbleText}>108 Amb 1.0km</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.radarLegend}>
                • Tap any pin above or browse facilities below for live directions & phone contact
              </Text>
            </View>

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
              style={{ marginBottom: SPACING.md }}
            >
              {[
                { id: 'ALL', label: 'All (सभी 5)', icon: '🏥' },
                { id: 'PHC', label: 'PHCs & CHCs', icon: '🩺' },
                { id: 'HOSPITAL', label: 'District Hospital', icon: '🏥' },
                { id: 'PHARMACY', label: 'Jan Aushadhi', icon: '💊' },
                { id: 'AMBULANCE', label: '24x7 Ambulance', icon: '🚑' },
                { id: 'ASHA', label: 'ASHA Didi', icon: '👩‍⚕️' },
              ].map((c) => {
                const isActive = facilityCategory === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.catChip, isActive && styles.catChipActive]}
                    onPress={() => setFacilityCategory(c.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.catChipIcon}>{c.icon}</Text>
                    <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Facility Cards List */}
            <View style={styles.facilityList}>
              {filteredFacilities.map((facility) => (
                <View key={facility.id} style={styles.facilityCard}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.facilityIconCircle}>
                      <Text style={{ fontSize: 22 }}>{facility.icon}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.facilityName}>{facility.name}</Text>
                      <Text style={styles.facilityNameHindi}>{facility.nameHindi}</Text>
                      <View style={styles.distanceBadgeRow}>
                        <View style={styles.distanceBadge}>
                          <Navigation size={11} color="#059669" />
                          <Text style={styles.distanceBadgeText}>{facility.distance} • {facility.eta}</Text>
                        </View>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusBadgeText}>{facility.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Address */}
                  <View style={styles.addressRow}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={styles.addressText}>{facility.address}</Text>
                  </View>

                  {/* Clinical Services Tags */}
                  <View style={styles.servicesPillRow}>
                    {facility.services.map((svc, i) => (
                      <View key={i} style={styles.servicePill}>
                        <Text style={styles.servicePillText}>{svc}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Action Buttons Row */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.dirBtn}
                      onPress={() => handleOpenDirections(facility)}
                      activeOpacity={0.8}
                    >
                      <Navigation size={14} color="#FFFFFF" />
                      <Text style={styles.dirBtnText}>Directions / नक्शा</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => handleCallFacility(facility.phone, facility.name)}
                      activeOpacity={0.8}
                    >
                      <PhoneCall size={14} color="#047857" />
                      <Text style={styles.callBtnText}>Call / फोन करें</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.detailBtn}
                      onPress={() => setSelectedFacility(facility)}
                      activeOpacity={0.8}
                    >
                      <Info size={14} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Emergency Speed Dial Footer Bar */}
            <View style={styles.emergencyDialBar}>
              <Text style={styles.dialBarTitle}>🚨 Quick Rural Emergency Helpline Dialers:</Text>
              <View style={styles.dialButtonsRow}>
                <TouchableOpacity
                  style={[styles.emergencyDialBtn, { backgroundColor: '#EF4444' }]}
                  onPress={() => handleCallFacility('108', '108 Ambulance')}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={14} color="#FFFFFF" />
                  <Text style={styles.emergencyDialText}>108 Ambulance</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.emergencyDialBtn, { backgroundColor: '#2563EB' }]}
                  onPress={() => handleCallFacility('104', '104 Health Helpline')}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={14} color="#FFFFFF" />
                  <Text style={styles.emergencyDialText}>104 Helpline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.emergencyDialBtn, { backgroundColor: '#059669' }]}
                  onPress={() => handleCallFacility('+919450098123', 'ASHA Didi')}
                  activeOpacity={0.85}
                >
                  <PhoneCall size={14} color="#FFFFFF" />
                  <Text style={styles.emergencyDialText}>ASHA Didi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* ========================================================= */
          /* MODE 2: 3D ANATOMICAL BODY & ORGANS EXPLORER              */
          /* ========================================================= */
          <View>
            {/* Header Title */}
            <View style={styles.header}>
              <Text style={styles.screenTitle}>3D Body & Organ Guide / मानव शरीर</Text>
              <Text style={styles.screenSubtitle}>
                Interactive anatomical explorer with organ education and clinical advice
              </Text>
            </View>

            {/* View Switcher: Front | Side | Back */}
            <View style={styles.viewToggleContainer}>
              <TouchableOpacity
                style={[styles.viewTab, selectedView === 'FRONT' && styles.viewTabActive]}
                onPress={() => setSelectedView('FRONT')}
              >
                <Text style={[styles.viewTabText, selectedView === 'FRONT' && styles.viewTabTextActive]}>
                  Front View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewTab, selectedView === 'SIDE' && styles.viewTabActive]}
                onPress={() => setSelectedView('SIDE')}
              >
                <Text style={[styles.viewTabText, selectedView === 'SIDE' && styles.viewTabTextActive]}>
                  Side View
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.viewTab, selectedView === 'BACK' && styles.viewTabActive]}
                onPress={() => setSelectedView('BACK')}
              >
                <Text style={[styles.viewTabText, selectedView === 'BACK' && styles.viewTabTextActive]}>
                  Back View
                </Text>
              </TouchableOpacity>
            </View>

            {/* 3D Anatomical Stage */}
            <View style={styles.anatomyStage}>
              <Image
                source={require('../../../assets/anatomy/clinical_human_anatomy.jpg')}
                style={styles.anatomyImage}
                resizeMode="contain"
              />

              {/* Interactive Anatomical Hotspots */}
              <TouchableOpacity
                style={[styles.hotspot, styles.hotspotBrain, selectedOrganKey === 'brain' && styles.hotspotActive]}
                onPress={() => handleOpenOrganDetails('brain')}
              >
                <Text style={styles.hotspotEmoji}>🧠</Text>
                <Text style={styles.hotspotLabel}>Brain</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotspot, styles.hotspotLungs, selectedOrganKey === 'lungs' && styles.hotspotActive]}
                onPress={() => handleOpenOrganDetails('lungs')}
              >
                <Text style={styles.hotspotEmoji}>🫁</Text>
                <Text style={styles.hotspotLabel}>Lungs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotspot, styles.hotspotHeart, selectedOrganKey === 'heart' && styles.hotspotActive]}
                onPress={() => handleOpenOrganDetails('heart')}
              >
                <Text style={styles.hotspotEmoji}>❤️</Text>
                <Text style={styles.hotspotLabel}>Heart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotspot, styles.hotspotStomach, selectedOrganKey === 'stomach' && styles.hotspotActive]}
                onPress={() => handleOpenOrganDetails('stomach')}
              >
                <Text style={styles.hotspotEmoji}>🫄</Text>
                <Text style={styles.hotspotLabel}>Stomach</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.hotspot, styles.hotspotKidneys, selectedOrganKey === 'kidneys' && styles.hotspotActive]}
                onPress={() => handleOpenOrganDetails('kidneys')}
              >
                <Text style={styles.hotspotEmoji}>🫘</Text>
                <Text style={styles.hotspotLabel}>Kidneys</Text>
              </TouchableOpacity>
            </View>

            {/* Organ Selector Carousel */}
            <Text style={styles.sectionHeading}>Select Body Area / अंग चुनें</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.organScroll}
            >
              {organKeys.map((key) => {
                const organ = MOCK_ORGANS[key];
                const isSelected = selectedOrganKey === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.organCard, isSelected && styles.organCardSelected]}
                    onPress={() => handleSelectOrgan(key)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.organCardEmoji}>{organ.icon}</Text>
                    <Text style={[styles.organCardName, isSelected && styles.organCardNameSelected]}>
                      {organ.name.split('&')[0]}
                    </Text>
                    <Text style={styles.organCardHindi}>{organ.hindiName.split(' ')[0]}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Selected Organ Interactive Card */}
            <View style={styles.activeOrganSummaryCard}>
              <View style={styles.organHeaderRow}>
                <Image source={currentOrgan.image} style={styles.organThumbnail} />
                <View style={styles.organHeaderInfo}>
                  <Text style={styles.organMainTitle}>{currentOrgan.name}</Text>
                  <Text style={styles.organHindiTitle}>{currentOrgan.hindiName}</Text>
                  <View style={styles.statusPill}>
                    <CheckCircle2 size={12} color={COLORS.success} />
                    <Text style={styles.statusPillText}>Status: Normal & Stable</Text>
                  </View>
                </View>
              </View>

              {/* Vitals Grid */}
              <View style={styles.vitalsRow}>
                {currentOrgan.vitals.map((v, i) => (
                  <View key={i} style={styles.vitalBox}>
                    <Text style={styles.vitalValue}>{v.value}</Text>
                    <Text style={styles.vitalLabel}>{v.label}</Text>
                  </View>
                ))}
              </View>

              {/* Active Prescriptions for this Organ */}
              <View style={styles.prescriptionsBlock}>
                <Text style={styles.blockTitle}>Active Prescriptions for this Area</Text>
                {currentOrgan.activeMedications.map((m, idx) => (
                  <View key={idx} style={styles.medTag}>
                    <FileText size={12} color={COLORS.primary} />
                    <Text style={styles.medTagText}>{m}</Text>
                  </View>
                ))}
              </View>

              {/* Health Education & Advice */}
              <View style={styles.educationBox}>
                <View style={styles.educationHeader}>
                  <Info size={14} color={COLORS.primaryDark} />
                  <Text style={styles.educationTitle}>Health Education / स्वास्थ्य सलाह</Text>
                  <TouchableOpacity
                    style={styles.speakerIconBtn}
                    onPress={() => {
                      const tip = currentLanguage === 'hi' ? currentOrgan.educationalTipHindi : currentOrgan.educationalTip;
                      VoiceAssistantService.speak(`${currentOrgan.hindiName || currentOrgan.name}: ${tip}`, currentLanguage);
                    }}
                  >
                    <Volume2 size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.educationBody}>
                  {currentLanguage === 'hi'
                    ? currentOrgan.educationalTipHindi
                    : currentOrgan.educationalTip}
                </Text>
              </View>

              {/* Ask Swasthya AI Button */}
              <TouchableOpacity
                style={styles.askAiButton}
                onPress={() => setOrganModalVisible(true)}
                activeOpacity={0.85}
              >
                <Sparkles size={16} color={COLORS.textInverse} />
                <Text style={styles.askAiButtonText}>Ask Swasthya AI about {currentOrgan.name.split('&')[0]}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Facility Details Modal Sheet */}
      {selectedFacility && (
        <Modal visible={!!selectedFacility} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.facilityModalSheet}>
              <View style={styles.modalHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalFacilityTitle}>{selectedFacility.name}</Text>
                  <Text style={styles.modalFacilitySub}>{selectedFacility.nameHindi}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelectedFacility(null)} style={styles.modalCloseBtn}>
                  <X size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: SPACING.md }}>
                {/* Distance & Status Bar */}
                <View style={styles.facilityMetaCard}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Distance / दूरी</Text>
                    <Text style={styles.metaValue}>{selectedFacility.distance}</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Travel Time / समय</Text>
                    <Text style={styles.metaValue}>{selectedFacility.eta}</Text>
                  </View>
                  <View style={styles.metaDivider} />
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Status / स्थिति</Text>
                    <Text style={[styles.metaValue, { color: '#059669' }]}>Open 24x7</Text>
                  </View>
                </View>

                {/* Doctor on Duty */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardHeading}>🩺 On-Duty Medical Officer</Text>
                  <Text style={styles.infoCardValue}>{selectedFacility.doctorOnDuty}</Text>
                </View>

                {/* Bed Occupancy & Supply Status */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardHeading}>🛏️ Hospital Capacity & Supplies</Text>
                  <Text style={styles.infoCardValue}>{selectedFacility.bedsAvailable}</Text>
                  <Text style={[styles.infoCardValue, { color: '#059669', marginTop: 4 }]}>
                    ✓ {selectedFacility.stockStatus}
                  </Text>
                </View>

                {/* Address */}
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardHeading}>📍 Physical Address</Text>
                  <Text style={styles.infoCardValue}>{selectedFacility.address}</Text>
                  <Text style={[styles.infoCardValue, { color: '#64748B', marginTop: 2 }]}>
                    {selectedFacility.addressHindi}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity
                    style={styles.modalDirBtn}
                    onPress={() => handleOpenDirections(selectedFacility)}
                  >
                    <Navigation size={16} color="#FFFFFF" />
                    <Text style={styles.modalDirBtnText}>Open Google Maps</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalCallBtn}
                    onPress={() => handleCallFacility(selectedFacility.phone, selectedFacility.name)}
                  >
                    <PhoneCall size={16} color="#047857" />
                    <Text style={styles.modalCallBtnText}>Call Now</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Interactive AI Assistant & Deep Dive Sheet for Anatomy */}
      <Modal visible={organModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleBlock}>
                <Text style={styles.modalOrganTitle}>{currentOrgan.name}</Text>
                <Text style={styles.modalOrganSub}>Swasthya AI Health Education</Text>
              </View>
              <TouchableOpacity onPress={() => setOrganModalVisible(false)} style={styles.modalCloseBtn}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Image source={currentOrgan.image} style={styles.modalOrganBanner} resizeMode="cover" />

              <Text style={styles.faqHeading}>Frequently Asked Rural Health Questions:</Text>
              {currentOrgan.aiSuggestedQuestions.map((q, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.faqCard}
                  onPress={() => {
                    Alert.alert(
                      q,
                      `Swasthya AI Explanation: ${currentOrgan.educationalTip}\n\n(Always take medicines at prescribed hours with proper meals.)`
                    );
                  }}
                  activeOpacity={0.7}
                >
                  <MessageSquare size={16} color={COLORS.primary} />
                  <Text style={styles.faqText}>{q}</Text>
                  <ChevronRight size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              ))}

              <View style={styles.aiGuidanceCard}>
                <Sparkles size={18} color={COLORS.secondary} />
                <Text style={styles.aiGuidanceText}>
                  "Your vitals for this organ system are well maintained under current prescription routine. Continue daily morning walking and drink adequate water."
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  mainModeContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 4,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  mainModeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mainModeTabActive: {
    backgroundColor: '#059669',
  },
  mainModeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  mainModeTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  header: {
    marginBottom: SPACING.md,
  },
  screenTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  gpsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gpsPulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  gpsSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  gpsBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  gpsBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  mapCanvasCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...SHADOWS.card,
  },
  mapCanvasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  mapCanvasTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapCanvasTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  mapRadiusIndicator: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  radarVisualStage: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  radarRing: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  radarCrosshairV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  radarCrosshairH: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  userCenterPin: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCenterPulse: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
  },
  userCenterDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userPinLabel: {
    position: 'absolute',
    top: '55%',
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  facilityPin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  pinEmoji: {
    fontSize: 20,
  },
  pinBubble: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
    marginTop: 2,
  },
  pinBubbleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  radarLegend: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  categoryScroll: {
    gap: 8,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  catChipActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  catChipIcon: {
    fontSize: 13,
  },
  catChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  catChipTextActive: {
    color: '#FFFFFF',
  },
  facilityList: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  facilityIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  facilityName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  facilityNameHindi: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  statusBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  addressText: {
    fontSize: 11,
    color: '#64748B',
  },
  servicesPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  servicePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  servicePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dirBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#047857',
    paddingVertical: 10,
    borderRadius: 10,
  },
  dirBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  callBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  callBtnText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '800',
  },
  detailBtn: {
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyDialBar: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: SPACING.sm,
  },
  dialBarTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: SPACING.sm,
  },
  dialButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emergencyDialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emergencyDialText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  // Mode 2: Anatomy Styles
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceSubtle,
    borderRadius: BORDER_RADIUS.full,
    padding: 3,
    marginBottom: SPACING.md,
  },
  viewTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
  },
  viewTabActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.subtle,
  },
  viewTabText: {
    ...TYPOGRAPHY.captionSmall,
    color: COLORS.textSecondary,
  },
  viewTabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  anatomyStage: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  anatomyImage: {
    width: '100%',
    height: '100%',
  },
  hotspot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.card,
  },
  hotspotActive: {
    backgroundColor: COLORS.primary,
    borderColor: '#FFFFFF',
  },
  hotspotEmoji: {
    fontSize: 14,
  },
  hotspotLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  hotspotBrain: { top: 20, left: '38%' },
  hotspotLungs: { top: 75, left: '22%' },
  hotspotHeart: { top: 85, right: '25%' },
  hotspotStomach: { top: 125, left: '32%' },
  hotspotKidneys: { top: 145, right: '28%' },
  sectionHeading: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  organScroll: {
    gap: 10,
    marginBottom: SPACING.md,
  },
  organCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    minWidth: 84,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  organCardSelected: {
    backgroundColor: '#ECFDF5',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  organCardEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  organCardName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  organCardNameSelected: {
    color: COLORS.primary,
  },
  organCardHindi: {
    fontSize: 10,
    color: '#64748B',
  },
  activeOrganSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.subtle,
  },
  organHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  organThumbnail: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  organHeaderInfo: {
    flex: 1,
  },
  organMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  organHindiTitle: {
    fontSize: 13,
    color: '#64748B',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  vitalsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.md,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  vitalLabel: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
  },
  prescriptionsBlock: {
    marginBottom: SPACING.md,
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  medTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  medTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  educationBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: SPACING.md,
  },
  educationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  educationTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  speakerIconBtn: {
    padding: 4,
  },
  educationBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  askAiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 12,
    ...SHADOWS.subtle,
  },
  askAiButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  // Modals Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  facilityModalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalFacilityTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalFacilitySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  modalCloseBtn: {
    padding: 6,
  },
  facilityMetaCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-between',
  },
  metaCol: {
    alignItems: 'center',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 3,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
  },
  modalDirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalDirBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  modalCallBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modalCallBtnText: {
    color: '#047857',
    fontSize: 13,
    fontWeight: '800',
  },
  // Anatomy Sheet
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: SPACING.lg,
    maxHeight: '80%',
  },
  modalTitleBlock: {
    flex: 1,
  },
  modalOrganTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalOrganSub: {
    fontSize: 12,
    color: '#64748B',
  },
  modalScroll: {
    marginTop: SPACING.sm,
  },
  modalOrganBanner: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    marginBottom: SPACING.md,
  },
  faqHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  faqCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  faqText: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
  },
  aiGuidanceCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: SPACING.sm,
  },
  aiGuidanceText: {
    flex: 1,
    fontSize: 12,
    color: '#166534',
    fontStyle: 'italic',
  },
});
