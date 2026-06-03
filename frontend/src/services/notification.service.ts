import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../types/medication.types';
import { Member } from '../types/family.types';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  /**
   * Request user permission for notifications
   */
  requestPermissions: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const isGranted = finalStatus === 'granted';
      console.log(`[Notification Service] Permission status: ${finalStatus} (${isGranted ? 'GRANTED' : 'DENIED'})`);
      return isGranted;
    } catch (err) {
      console.error('[Notification Service] Error requesting permission:', err);
      return false;
    }
  },

  /**
   * Cancel all currently scheduled notifications
   */
  cancelAllReminders: async (): Promise<void> => {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[Notification Service] Cancelled all scheduled reminders.');
    } catch (err) {
      console.error('[Notification Service] Error cancelling reminders:', err);
    }
  },

  /**
   * Schedule reminders for all active medications
   */
  scheduleAllMedicationReminders: async (medications: Medication[], members: Member[]): Promise<void> => {
    if (Platform.OS === 'web') return;

    try {
      // First, cancel any previously scheduled notifications to avoid duplicates
      await notificationService.cancelAllReminders();

      // Filter active medications
      const activeMeds = medications.filter((m) => m.active);
      console.log(`[Notification Service] Setting reminders for ${activeMeds.length} active medications...`);

      for (const med of activeMeds) {
        // Find corresponding member for patient context
        const member = members.find((m) => m.id === med.memberId || (m as any)._id === med.memberId);
        const memberName = member ? member.fullName : 'Thành viên';

        if (!med.schedule || med.schedule.length === 0) continue;

        for (const slot of med.schedule) {
          const [hourStr, minuteStr] = slot.split(':');
          const hour = parseInt(hourStr, 10);
          const minute = parseInt(minuteStr, 10);

          if (isNaN(hour) || isNaN(minute)) {
            console.warn(`[Notification Service] Invalid schedule time slot format: "${slot}" for medication "${med.name}"`);
            continue;
          }

          try {
            const notificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Đến giờ uống thuốc 💊',
                body: `${memberName} cần uống ${med.name} - Liều: ${med.dosage}`,
                data: {
                  medicationId: med.id,
                  timeSlot: slot,
                  memberName,
                },
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour,
                minute,
              },
            });
            console.log(
              `[Notification Service] Scheduled reminder: "${med.name}" for ${memberName} at ${slot}. ID: ${notificationId}`
            );
          } catch (slotErr) {
            console.error(`[Notification Service] Failed to schedule slot "${slot}" for "${med.name}":`, slotErr);
          }
        }
      }
    } catch (err) {
      console.error('[Notification Service] Error scheduling medication reminders:', err);
    }
  },
};

export default notificationService;
