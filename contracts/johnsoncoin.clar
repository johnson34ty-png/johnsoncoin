;; JohnsonCoin (JOHN) - A SIP-010 compliant fungible token
;; Author: Anthony Johnson
;; Description: JohnsonCoin is a fungible token built on the Stacks blockchain

;; SIP-010 compliant fungible token
;; This contract implements all SIP-010 standard functions

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))

;; Token definitions
(define-fungible-token johnsoncoin)

;; Variables
(define-data-var token-name (string-ascii 32) "JohnsonCoin")
(define-data-var token-symbol (string-ascii 10) "JOHN")
(define-data-var token-uri (optional (string-utf8 256)) none)
(define-data-var token-decimals uint u6)

;; Total supply: 1 billion JOHN tokens (with 6 decimals)
(define-constant TOTAL_SUPPLY u1000000000000000)

;; Initialize contract by minting total supply to contract owner
(begin
  (try! (ft-mint? johnsoncoin TOTAL_SUPPLY CONTRACT_OWNER))
)

;; SIP-010 Functions

;; Transfer tokens
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender from) (is-eq contract-caller from)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (try! (ft-transfer? johnsoncoin amount from to))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

;; Get name
(define-read-only (get-name)
  (ok (var-get token-name))
)

;; Get symbol
(define-read-only (get-symbol)
  (ok (var-get token-symbol))
)

;; Get decimals
(define-read-only (get-decimals)
  (ok (var-get token-decimals))
)

;; Get balance of a principal
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance johnsoncoin who))
)

;; Get total supply
(define-read-only (get-total-supply)
  (ok (ft-get-supply johnsoncoin))
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

;; Additional functions

;; Mint tokens (only contract owner)
(define-public (mint (amount uint) (to principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-mint? johnsoncoin amount to)
  )
)

;; Burn tokens
(define-public (burn (amount uint) (from principal))
  (begin
    (asserts! (or (is-eq tx-sender from) (is-eq contract-caller from)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (ft-burn? johnsoncoin amount from)
  )
)

;; Set token URI (only contract owner)
(define-public (set-token-uri (value (optional (string-utf8 256))))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set token-uri value)
    (ok true)
  )
)

;; Transfer ownership (only current owner)
(define-data-var contract-owner principal CONTRACT_OWNER)

(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) ERR_OWNER_ONLY)
    (var-set contract-owner new-owner)
    (ok true)
  )
)

;; Get contract owner
(define-read-only (get-contract-owner)
  (ok (var-get contract-owner))
)

;; title: johnsoncoin
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;

;; read only functions
;;

;; private functions
;;

