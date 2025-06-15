// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UnilorinVoting is Ownable, ReentrancyGuard {
    
    struct Student {
        address walletAddress;
        string email;
        string matricNumber;
        string firstName;
        string lastName;
        string faculty;
        string department;
        bool isVerified;
        bool isRegistered;
        uint256 registrationTime;
    }
    
    struct Candidate {
        uint256 id;
        string name;
        string matricNumber;
        string faculty;
        string department;
        string manifesto;
        string experience;
        uint256 positionId;
        uint256 voteCount;
        bool isActive;
    }
    
    struct Position {
        uint256 id;
        string title;
        string description;
        bool isActive;
        uint256 candidateCount;
    }
    
    struct Vote {
        address voter;
        uint256 positionId;
        uint256 candidateId;
        uint256 timestamp;
        bytes32 voteHash;
    }
    // State variables
    uint256 private _candidateIds;
    uint256 private _positionIds;
    uint256 private _voteIds;
    mapping(string => address) public emailToAddress;
    mapping(address => Student) public students;
    mapping(uint256 => Candidate) public candidates;
    mapping(uint256 => Position) public positions;
    mapping(uint256 => Vote) public votes;
    
    // Voting tracking
    mapping(address => mapping(uint256 => bool)) public hasVoted; // voter => positionId => hasVoted
    mapping(address => uint256[]) public voterPositions; // positions voted by address
    
    // Election settings
    uint256 public votingStartTime;
    uint256 public votingEndTime;
    bool public registrationOpen;
    bool public votingOpen;
    
    // Events
    event StudentRegistered(address indexed student, string email, string matricNumber);
    event StudentVerified(address indexed student, string email);
    event CandidateAdded(uint256 indexed candidateId, string name, uint256 positionId);
    event PositionAdded(uint256 indexed positionId, string title);
    event VoteCast(address indexed voter, uint256 indexed positionId, uint256 indexed candidateId, uint256 voteId);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);
    
    modifier onlyVerifiedStudent() {
        require(students[msg.sender].isVerified, "Student not verified");
        _;
    }
    
    modifier onlyDuringVoting() {
        require(votingOpen, "Voting is not open");
        require(block.timestamp >= votingStartTime, "Voting has not started");
        require(block.timestamp <= votingEndTime, "Voting has ended");
        _;
    }
    
    modifier onlyDuringRegistration() {
        require(registrationOpen, "Registration is closed");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        registrationOpen = true;
        votingOpen = false;
    }
    
    // Student registration and verification
    function registerStudent(
        string memory _email,
        string memory _matricNumber,
        string memory _firstName,
        string memory _lastName,
        string memory _faculty,
        string memory _department
    ) external onlyDuringRegistration {
        require(!students[msg.sender].isRegistered, "Student already registered");
        require(emailToAddress[_email] == address(0), "Email already registered");
        
        students[msg.sender] = Student({
            walletAddress: msg.sender,
            email: _email,
            matricNumber: _matricNumber,
            firstName: _firstName,
            lastName: _lastName,
            faculty: _faculty,
            department: _department,
            isVerified: false,
            isRegistered: true,
            registrationTime: block.timestamp
        });
        
        emailToAddress[_email] = msg.sender;
        
        emit StudentRegistered(msg.sender, _email, _matricNumber);
    }
    
    function verifyStudent(address _student) external onlyOwner {
        require(students[_student].isRegistered, "Student not registered");
        students[_student].isVerified = true;
        
        emit StudentVerified(_student, students[_student].email);
    }
    
    // Position management
    function addPosition(string memory _title, string memory _description) external onlyOwner {
        _positionIds++;
        uint256 positionId = _positionIds;
        
        positions[positionId] = Position({
            id: positionId,
            title: _title,
            description: _description,
            isActive: true,
            candidateCount: 0
        });
        
        emit PositionAdded(positionId, _title);
    }
    
    // Candidate management
    function addCandidate(
        string memory _name,
        string memory _matricNumber,
        string memory _faculty,
        string memory _department,
        string memory _manifesto,
        string memory _experience,
        uint256 _positionId
    ) external onlyOwner {
        require(positions[_positionId].isActive, "Position does not exist");
        
        _candidateIds++;
        uint256 candidateId = _candidateIds;
        
        candidates[candidateId] = Candidate({
            id: candidateId,
            name: _name,
            matricNumber: _matricNumber,
            faculty: _faculty,
            department: _department,
            manifesto: _manifesto,
            experience: _experience,
            positionId: _positionId,
            voteCount: 0,
            isActive: true
        });
        
        positions[_positionId].candidateCount++;
        
        emit CandidateAdded(candidateId, _name, _positionId);
    }
    
    // Voting functions
    function castVote(uint256 _positionId, uint256 _candidateId) 
        external 
        onlyVerifiedStudent 
        onlyDuringVoting 
        nonReentrant 
    {
        require(positions[_positionId].isActive, "Position does not exist");
        require(candidates[_candidateId].isActive, "Candidate does not exist");
        require(candidates[_candidateId].positionId == _positionId, "Candidate not in this position");
        require(!hasVoted[msg.sender][_positionId], "Already voted for this position");
        
        // Record the vote
        _voteIds++;
        uint256 voteId = _voteIds;
        
        bytes32 voteHash = keccak256(abi.encodePacked(msg.sender, _positionId, _candidateId, block.timestamp));
        
        votes[voteId] = Vote({
            voter: msg.sender,
            positionId: _positionId,
            candidateId: _candidateId,
            timestamp: block.timestamp,
            voteHash: voteHash
        });
        
        // Update vote tracking
        hasVoted[msg.sender][_positionId] = true;
        voterPositions[msg.sender].push(_positionId);
        candidates[_candidateId].voteCount++;
        
        emit VoteCast(msg.sender, _positionId, _candidateId, voteId);
    }
    
    // Election management
    function startVoting(uint256 _duration) external onlyOwner {
        require(!votingOpen, "Voting already started");
        
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + _duration;
        votingOpen = true;
        registrationOpen = false;
        
        emit VotingStarted(votingStartTime, votingEndTime);
    }
    
    function endVoting() external onlyOwner {
        require(votingOpen, "Voting not started");
        
        votingOpen = false;
        votingEndTime = block.timestamp;
        
        emit VotingEnded(votingEndTime);
    }
    
    // View functions
    function getStudent(address _student) external view returns (Student memory) {
        return students[_student];
    }
    
    function getCandidate(uint256 _candidateId) external view returns (Candidate memory) {
        return candidates[_candidateId];
    }
    
    function getPosition(uint256 _positionId) external view returns (Position memory) {
        return positions[_positionId];
    }
    
    function getCandidatesByPosition(uint256 _positionId) external view returns (Candidate[] memory) {
        uint256 candidateCount = positions[_positionId].candidateCount;
        Candidate[] memory positionCandidates = new Candidate[](candidateCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= _candidateIds; i++) {
            if (candidates[i].positionId == _positionId && candidates[i].isActive) {
                positionCandidates[index] = candidates[i];
                index++;
            }
        }
        
        return positionCandidates;
    }
    
    function getVotingStatus() external view returns (bool, uint256, uint256) {
        return (votingOpen, votingStartTime, votingEndTime);
    }
    
    function getTotalVotes() external view returns (uint256) {
        return _voteIds;
    }
    
    function getTotalCandidates() external view returns (uint256) {
        return _candidateIds;
    }
    
    function getTotalPositions() external view returns (uint256) {
        return _positionIds;
    }
    
    function hasStudentVoted(address _student, uint256 _positionId) external view returns (bool) {
        return hasVoted[_student][_positionId];
    }
    
        function getVoterPositions(address _student) external view returns (uint256[] memory) {
            return voterPositions[_student];
        }
    }