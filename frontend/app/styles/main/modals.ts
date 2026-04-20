import { StyleSheet } from "react-native"
import { COLORS, SPACING } from "../theme"

export const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  overlayScroll: { 
    flexGrow: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 30, 
    width: '100%' 
  },
  modalBox: { 
    backgroundColor: COLORS.surface,
    width: '85%', 
    maxWidth: 480, 
    borderRadius: 12, 
    padding: SPACING.xl, 
    gap: SPACING.lg
  },
  modalTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: COLORS.text 
  },
  modalActions: { 
    flexDirection: 'row', 
    gap: SPACING.sm,
    marginTop: SPACING.xs 
  },
  btn: { 
    flex: 1, 
    paddingVertical: 11, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  btnCancel: { 
    backgroundColor: COLORS.borderLight
  },
  btnCancelText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15 
  },
  btnBlue: {
    backgroundColor: COLORS.primary
  },
  btnRed: { 
    backgroundColor: COLORS.error 
  },
  btnText: { 
    color: COLORS.white, 
    fontWeight: '700', 
    fontSize: 15
  },
})
