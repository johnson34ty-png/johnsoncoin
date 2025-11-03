;; title: johnsonbit
;; version: 1.0.0
;; summary: A simple fungible token for JohnsonBit (JBIT)
;; description: Minimal FT with mint (owner-only) and transfer, plus read-only getters.

;; ----------------------------
;; Constants
;; ----------------------------
(define-constant TOKEN-NAME "JohnsonBit")
(define-constant TOKEN-SYMBOL "JBIT")
(define-constant TOKEN-DECIMALS u6)

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-INSUFFICIENT-BALANCE u101)
(define-constant ERR-SENDER-NOT-TX u102)
(define-constant ERR-AMOUNT-ZERO u103)

;; ----------------------------
;; Data storage
;; ----------------------------
(define-data-var total-supply uint u0)
(define-map balances { address: principal } { balance: uint })

;; ----------------------------
;; Public functions
;; ----------------------------
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (if (not (is-eq tx-sender sender))
        (err ERR-SENDER-NOT-TX)
        (if (or (is-eq amount u0) (is-eq sender recipient))
            (err ERR-AMOUNT-ZERO)
            (let (
                  (sender-bal (match (map-get? balances { address: sender }) data (get balance data) u0))
                  (recipient-bal (match (map-get? balances { address: recipient }) data (get balance data) u0))
                 )
              (if (< sender-bal amount)
                  (err ERR-INSUFFICIENT-BALANCE)
                  (begin
                    (map-set balances { address: sender } { balance: (- sender-bal amount) })
                    (map-set balances { address: recipient } { balance: (+ recipient-bal amount) })
                    (ok true))))))))

(define-public (mint (amount uint) (to principal))
  (if (not (is-eq tx-sender to))
      (err ERR-NOT-AUTHORIZED)
      (if (is-eq amount u0)
          (err ERR-AMOUNT-ZERO)
          (let ((current (match (map-get? balances { address: to }) data (get balance data) u0)))
            (var-set total-supply (+ (var-get total-supply) amount))
            (map-set balances { address: to } { balance: (+ current amount) })
            (ok true)))))

;; ----------------------------
;; Read-only functions
;; ----------------------------
(define-read-only (get-name)
  TOKEN-NAME)

(define-read-only (get-symbol)
  TOKEN-SYMBOL)

(define-read-only (get-decimals)
  TOKEN-DECIMALS)

(define-read-only (get-total-supply)
  (var-get total-supply))

(define-read-only (get-balance (who principal))
  (match (map-get? balances { address: who })
    data (get balance data)
    u0))
