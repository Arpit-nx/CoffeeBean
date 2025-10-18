#To-do:
'''
get funds from users
withdraw funds
set the minimum fucding value in USD
'''

#pragma version ^0.4.0

# @license: MIT
# @title Buy me a Coffee
# @author Me!
# @notice This contract is for creating a sample funding contract


# This interface works as ABI
interface AggregatorV3Interface:
    def decimals() -> uint8: view
    def description() -> String[1000]: view
    def version() -> uint256: view
    def latestAnswer() -> int256: view

#Constants & Immutables
PRICE_FEED: public(immutable(AggregatorV3Interface)) # 0x694AA1769357215DE4FAC081bf1f309aDC325306 seploia testnet
MIN_USD: public(constant(uint256)) = as_wei_value(5, "ether")
OWNER: public(immutable(address))
PRECISION: constant(uint256) = 1 * (10 ** 10)

funders: public(DynArray[address, 1000]) # Dynamic array initialization for listing down the address of funders in our list.
funder_to_amount_funded: public(HashMap[address, uint256])

@deploy
def __init__(price_feed_address: address):
    PRICE_FEED = AggregatorV3Interface(price_feed_address)
    OWNER = msg.sender

@external
@payable
def fund():
    self._fund()

@internal
@payable #important for making a function mandatory for transaction.
def _fund():
    """
    Allows user to send $ to this contract
    Have a minimum $ amount send

    1. How do we send ETH to this contract?
    """

    usd_value_of_eth: uint256 = self._get_eth_to_USD_rate(msg.value)
    assert usd_value_of_eth >= MIN_USD, "You must spend more ETH!"
    self.funders.append(msg.sender)
    self.funder_to_amount_funded[msg.sender] += msg.value

    # What is a revert?
    # It undoes any actions that have been done, and sends the remaining gas back.

@external
def withdraw():
    assert msg.sender == OWNER, "You are not the owner"
    # send(self.owner, self.balance)
    #self.balance keyword provides the balance of the deployed smart contract.
    raw_call(OWNER, b"", value = self.balance)

    for funder: address in self.funders:
        self.funder_to_amount_funded[funder] = 0
    self.funders = []

@internal
@view
def _get_eth_to_USD_rate(eth_amount: uint256)-> uint256:
    # To interact with an external contract, two things are required:
    # 1. Address : 0x694AA1769357215DE4FAC081bf1f309aDC325306
    # 2. ABI( Application Binary Interface ) : 
    price: int256 = staticcall PRICE_FEED.latestAnswer()
    # This will return some answer in a whole number format with 8 places of decimal.
    eth_price: uint256 = convert(price, uint256) * (10 ** 10) # Convert fucntion converts any type into another data type.
    eth_amount_in_usd: uint256 = (eth_amount * eth_price) // PRECISION

    return eth_amount_in_usd

@external
@view
def get_eth_to_USD_rate(eth_amount: uint256) -> uint256:
    return self._get_eth_to_USD_rate(eth_amount)

@external
@payable
def __default__():
    self._fund()

# IMPORTANT NOTE:
# To get data from external environment, we need to use Chainlink Orcale tech that works as a bridge to connect th e blockchain world with the outer world data in a decentralised manner


# @external
# @view
# def get_price() -> int256:
#     price_feed: AggregatorV3Interface = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306)
#     return staticcall price_feed.latestAnswer()
#    # staticcall means that we are not going to modify the content but just using it.
#    # excall is just the opposite of staticcall.
