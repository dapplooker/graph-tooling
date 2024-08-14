import {
  AddBaseToken as AddBaseTokenEvent,
  AddYieldToken as AddYieldTokenEvent,
  AdminUpdated as AdminUpdatedEvent,
  ApproveBorrow as ApproveBorrowEvent,
  ApproveWithdraw as ApproveWithdrawEvent,
  BaseTokenEnabled as BaseTokenEnabledEvent,
  Borrow as BorrowEvent,
  BorrowingLimitUpdated as BorrowingLimitUpdatedEvent,
  CreditUnlockRateUpdated as CreditUnlockRateUpdatedEvent,
  DepositYieldToken as DepositYieldTokenEvent,
  Donate as DonateEvent,
  Harvest as HarvestEvent,
  HarvestExceedsOffset as HarvestExceedsOffsetEvent,
  Initialized as InitializedEvent,
  KeeperSet as KeeperSetEvent,
  MaximumExpectedValueUpdated as MaximumExpectedValueUpdatedEvent,
  MaximumLossUpdated as MaximumLossUpdatedEvent,
  MinimumCollateralizationUpdated as MinimumCollateralizationUpdatedEvent,
  PendingAdminUpdated as PendingAdminUpdatedEvent,
  ProtocolFeeReceiverUpdated as ProtocolFeeReceiverUpdatedEvent,
  ProtocolFeeUpdated as ProtocolFeeUpdatedEvent,
  ProtocolTokenRequiredActiveUpdated as ProtocolTokenRequiredActiveUpdatedEvent,
  RedlistActiveUpdated as RedlistActiveUpdatedEvent,
  RepayLimitUpdated as RepayLimitUpdatedEvent,
  RepayWithBaseToken as RepayWithBaseTokenEvent,
  RepayWithCollateral as RepayWithCollateralEvent,
  RepayWithCollateralLimitUpdated as RepayWithCollateralLimitUpdatedEvent,
  RepayWithDebtToken as RepayWithDebtTokenEvent,
  SavvySageUpdated as SavvySageUpdatedEvent,
  SentinelSet as SentinelSetEvent,
  Snap as SnapEvent,
  SweepTokens as SweepTokensEvent,
  TokenAdapterUpdated as TokenAdapterUpdatedEvent,
  WithdrawYieldToken as WithdrawYieldTokenEvent,
  YieldTokenEnabled as YieldTokenEnabledEvent
} from "../generated/SVBTCPosition/SVBTCPosition"
import {} from "../generated/SVBTCPosition/SVBTCPosition"
import {
  SVBTCPositionAddBaseTokenEvent as SVBTCPositionAddBaseTokenEventSchema,
  SVBTCPositionAddYieldTokenEvent as SVBTCPositionAddYieldTokenEventSchema,
  SVBTCPositionAdminUpdatedEvent as SVBTCPositionAdminUpdatedEventSchema,
  SVBTCPositionApproveBorrowEvent as SVBTCPositionApproveBorrowEventSchema,
  SVBTCPositionApproveWithdrawEvent as SVBTCPositionApproveWithdrawEventSchema,
  SVBTCPositionBaseTokenEnabledEvent as SVBTCPositionBaseTokenEnabledEventSchema,
  SVBTCPositionBorrowEvent as SVBTCPositionBorrowEventSchema,
  SVBTCPositionBorrowingLimitUpdatedEvent as SVBTCPositionBorrowingLimitUpdatedEventSchema,
  SVBTCPositionCreditUnlockRateUpdatedEvent as SVBTCPositionCreditUnlockRateUpdatedEventSchema,
  SVBTCPositionDepositYieldTokenEvent as SVBTCPositionDepositYieldTokenEventSchema,
  SVBTCPositionDonateEvent as SVBTCPositionDonateEventSchema,
  SVBTCPositionHarvestEvent as SVBTCPositionHarvestEventSchema,
  SVBTCPositionHarvestExceedsOffsetEvent as SVBTCPositionHarvestExceedsOffsetEventSchema,
  SVBTCPositionInitializedEvent as SVBTCPositionInitializedEventSchema,
  SVBTCPositionKeeperSetEvent as SVBTCPositionKeeperSetEventSchema,
  SVBTCPositionMaximumExpectedValueUpdatedEvent as SVBTCPositionMaximumExpectedValueUpdatedEventSchema,
  SVBTCPositionMaximumLossUpdatedEvent as SVBTCPositionMaximumLossUpdatedEventSchema,
  SVBTCPositionMinimumCollateralizationUpdatedEvent as SVBTCPositionMinimumCollateralizationUpdatedEventSchema,
  SVBTCPositionPendingAdminUpdatedEvent as SVBTCPositionPendingAdminUpdatedEventSchema,
  SVBTCPositionProtocolFeeReceiverUpdatedEvent as SVBTCPositionProtocolFeeReceiverUpdatedEventSchema,
  SVBTCPositionProtocolFeeUpdatedEvent as SVBTCPositionProtocolFeeUpdatedEventSchema,
  SVBTCPositionProtocolTokenRequiredActiveUpdatedEvent as SVBTCPositionProtocolTokenRequiredActiveUpdatedEventSchema,
  SVBTCPositionRedlistActiveUpdatedEvent as SVBTCPositionRedlistActiveUpdatedEventSchema,
  SVBTCPositionRepayLimitUpdatedEvent as SVBTCPositionRepayLimitUpdatedEventSchema,
  SVBTCPositionRepayWithBaseTokenEvent as SVBTCPositionRepayWithBaseTokenEventSchema,
  SVBTCPositionRepayWithCollateralEvent as SVBTCPositionRepayWithCollateralEventSchema,
  SVBTCPositionRepayWithCollateralLimitUpdatedEvent as SVBTCPositionRepayWithCollateralLimitUpdatedEventSchema,
  SVBTCPositionRepayWithDebtTokenEvent as SVBTCPositionRepayWithDebtTokenEventSchema,
  SVBTCPositionSavvySageUpdatedEvent as SVBTCPositionSavvySageUpdatedEventSchema,
  SVBTCPositionSentinelSetEvent as SVBTCPositionSentinelSetEventSchema,
  SVBTCPositionSnapEvent as SVBTCPositionSnapEventSchema,
  SVBTCPositionSweepTokensEvent as SVBTCPositionSweepTokensEventSchema,
  SVBTCPositionTokenAdapterUpdatedEvent as SVBTCPositionTokenAdapterUpdatedEventSchema,
  SVBTCPositionWithdrawYieldTokenEvent as SVBTCPositionWithdrawYieldTokenEventSchema,
  SVBTCPositionYieldTokenEnabledEvent as SVBTCPositionYieldTokenEnabledEventSchema
} from "../generated/schema"
import {} from "../generated/schema"

export function handleAddBaseTokenEvent(event: AddBaseTokenEvent): void {
  let entity = new SVBTCPositionAddBaseTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.baseToken = event.params.baseToken
  entity.save()
}

export function handleAddYieldTokenEvent(event: AddYieldTokenEvent): void {
  let entity = new SVBTCPositionAddYieldTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.save()
}

export function handleAdminUpdatedEvent(event: AdminUpdatedEvent): void {
  let entity = new SVBTCPositionAdminUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.admin = event.params.admin
  entity.save()
}

export function handleApproveBorrowEvent(event: ApproveBorrowEvent): void {
  let entity = new SVBTCPositionApproveBorrowEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.amount = event.params.amount
  entity.save()
}

export function handleApproveWithdrawEvent(event: ApproveWithdrawEvent): void {
  let entity = new SVBTCPositionApproveWithdrawEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.yieldToken = event.params.yieldToken
  entity.amount = event.params.amount
  entity.save()
}

export function handleBaseTokenEnabledEvent(
  event: BaseTokenEnabledEvent
): void {
  let entity = new SVBTCPositionBaseTokenEnabledEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.baseToken = event.params.baseToken
  entity.enabled = event.params.enabled
  entity.save()
}

export function handleBorrowEvent(event: BorrowEvent): void {
  let entity = new SVBTCPositionBorrowEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.owner = event.params.owner
  entity.amount = event.params.amount
  entity.recipient = event.params.recipient
  entity.save()
}

export function handleBorrowingLimitUpdatedEvent(
  event: BorrowingLimitUpdatedEvent
): void {
  let entity = new SVBTCPositionBorrowingLimitUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.maximum = event.params.maximum
  entity.blocks = event.params.blocks
  entity.save()
}

export function handleCreditUnlockRateUpdatedEvent(
  event: CreditUnlockRateUpdatedEvent
): void {
  let entity = new SVBTCPositionCreditUnlockRateUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.blocks = event.params.blocks
  entity.save()
}

export function handleDepositYieldTokenEvent(
  event: DepositYieldTokenEvent
): void {
  let entity = new SVBTCPositionDepositYieldTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sender = event.params.sender
  entity.yieldToken = event.params.yieldToken
  entity.amount = event.params.amount
  entity.recipient = event.params.recipient
  entity.save()
}

export function handleDonateEvent(event: DonateEvent): void {
  let entity = new SVBTCPositionDonateEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sender = event.params.sender
  entity.yieldToken = event.params.yieldToken
  entity.amount = event.params.amount
  entity.save()
}

export function handleHarvestEvent(event: HarvestEvent): void {
  let entity = new SVBTCPositionHarvestEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.minimumAmountOut = event.params.minimumAmountOut
  entity.totalHarvested = event.params.totalHarvested
  entity.credit = event.params.credit
  entity.save()
}

export function handleHarvestExceedsOffsetEvent(
  event: HarvestExceedsOffsetEvent
): void {
  let entity = new SVBTCPositionHarvestExceedsOffsetEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.currentValue = event.params.currentValue
  entity.expectedValue = event.params.expectedValue
  entity.save()
}

export function handleInitializedEvent(event: InitializedEvent): void {
  let entity = new SVBTCPositionInitializedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.version = event.params.version
  entity.save()
}

export function handleKeeperSetEvent(event: KeeperSetEvent): void {
  let entity = new SVBTCPositionKeeperSetEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sentinel = event.params.sentinel
  entity.flag = event.params.flag
  entity.save()
}

export function handleMaximumExpectedValueUpdatedEvent(
  event: MaximumExpectedValueUpdatedEvent
): void {
  let entity = new SVBTCPositionMaximumExpectedValueUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.maximumExpectedValue = event.params.maximumExpectedValue
  entity.save()
}

export function handleMaximumLossUpdatedEvent(
  event: MaximumLossUpdatedEvent
): void {
  let entity = new SVBTCPositionMaximumLossUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.maximumLoss = event.params.maximumLoss
  entity.save()
}

export function handleMinimumCollateralizationUpdatedEvent(
  event: MinimumCollateralizationUpdatedEvent
): void {
  let entity = new SVBTCPositionMinimumCollateralizationUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.minimumCollateralization = event.params.minimumCollateralization
  entity.save()
}

export function handlePendingAdminUpdatedEvent(
  event: PendingAdminUpdatedEvent
): void {
  let entity = new SVBTCPositionPendingAdminUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.pendingAdmin = event.params.pendingAdmin
  entity.save()
}

export function handleProtocolFeeReceiverUpdatedEvent(
  event: ProtocolFeeReceiverUpdatedEvent
): void {
  let entity = new SVBTCPositionProtocolFeeReceiverUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.protocolFeeReceiver = event.params.protocolFeeReceiver
  entity.save()
}

export function handleProtocolFeeUpdatedEvent(
  event: ProtocolFeeUpdatedEvent
): void {
  let entity = new SVBTCPositionProtocolFeeUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.protocolFee = event.params.protocolFee
  entity.save()
}

export function handleProtocolTokenRequiredActiveUpdatedEvent(
  event: ProtocolTokenRequiredActiveUpdatedEvent
): void {
  let entity = new SVBTCPositionProtocolTokenRequiredActiveUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.flag = event.params.flag
  entity.save()
}

export function handleRedlistActiveUpdatedEvent(
  event: RedlistActiveUpdatedEvent
): void {
  let entity = new SVBTCPositionRedlistActiveUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.flag = event.params.flag
  entity.save()
}

export function handleRepayLimitUpdatedEvent(
  event: RepayLimitUpdatedEvent
): void {
  let entity = new SVBTCPositionRepayLimitUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.baseToken = event.params.baseToken
  entity.maximum = event.params.maximum
  entity.blocks = event.params.blocks
  entity.save()
}

export function handleRepayWithBaseTokenEvent(
  event: RepayWithBaseTokenEvent
): void {
  let entity = new SVBTCPositionRepayWithBaseTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sender = event.params.sender
  entity.baseToken = event.params.baseToken
  entity.amount = event.params.amount
  entity.recipient = event.params.recipient
  entity.credit = event.params.credit
  entity.save()
}

export function handleRepayWithCollateralEvent(
  event: RepayWithCollateralEvent
): void {
  let entity = new SVBTCPositionRepayWithCollateralEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.owner = event.params.owner
  entity.yieldToken = event.params.yieldToken
  entity.baseToken = event.params.baseToken
  entity.shares = event.params.shares
  entity.credit = event.params.credit
  entity.save()
}

export function handleRepayWithCollateralLimitUpdatedEvent(
  event: RepayWithCollateralLimitUpdatedEvent
): void {
  let entity = new SVBTCPositionRepayWithCollateralLimitUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.baseToken = event.params.baseToken
  entity.maximum = event.params.maximum
  entity.blocks = event.params.blocks
  entity.save()
}

export function handleRepayWithDebtTokenEvent(
  event: RepayWithDebtTokenEvent
): void {
  let entity = new SVBTCPositionRepayWithDebtTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sender = event.params.sender
  entity.amount = event.params.amount
  entity.recipient = event.params.recipient
  entity.save()
}

export function handleSavvySageUpdatedEvent(
  event: SavvySageUpdatedEvent
): void {
  let entity = new SVBTCPositionSavvySageUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.savvySage = event.params.savvySage
  entity.save()
}

export function handleSentinelSetEvent(event: SentinelSetEvent): void {
  let entity = new SVBTCPositionSentinelSetEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.sentinel = event.params.sentinel
  entity.flag = event.params.flag
  entity.save()
}

export function handleSnapEvent(event: SnapEvent): void {
  let entity = new SVBTCPositionSnapEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.expectedValue = event.params.expectedValue
  entity.save()
}

export function handleSweepTokensEvent(event: SweepTokensEvent): void {
  let entity = new SVBTCPositionSweepTokensEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.rewardToken = event.params.rewardToken
  entity.amount = event.params.amount
  entity.save()
}

export function handleTokenAdapterUpdatedEvent(
  event: TokenAdapterUpdatedEvent
): void {
  let entity = new SVBTCPositionTokenAdapterUpdatedEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.tokenAdapter = event.params.tokenAdapter
  entity.save()
}

export function handleWithdrawYieldTokenEvent(
  event: WithdrawYieldTokenEvent
): void {
  let entity = new SVBTCPositionWithdrawYieldTokenEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.owner = event.params.owner
  entity.yieldToken = event.params.yieldToken
  entity.shares = event.params.shares
  entity.recipient = event.params.recipient
  entity.save()
}

export function handleYieldTokenEnabledEvent(
  event: YieldTokenEnabledEvent
): void {
  let entity = new SVBTCPositionYieldTokenEnabledEventSchema(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.txHash = event.transaction.hash
  entity.fromAddress = event.transaction.from
  entity.toAddress = event.transaction.to
  entity.valueTransferred = event.transaction.value
  entity.gasLimit = event.transaction.gasLimit
  entity.gasPrice = event.transaction.gasPrice
  entity.blockTimestamp = event.block.timestamp
  entity.yieldToken = event.params.yieldToken
  entity.enabled = event.params.enabled
  entity.save()
}
