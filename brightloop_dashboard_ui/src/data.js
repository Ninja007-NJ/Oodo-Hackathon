export const STATUS = {
  covered: { label: 'Covered (estimate)', icon: '●', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'text-status-covered', dotDark: 'text-emerald-600' },
  partial: { label: 'Partial', icon: '◐', badge: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'text-status-partial', dotDark: 'text-amber-600' },
  missing: { label: 'Not found', icon: '○', badge: 'bg-neutral-100 text-neutral-600 border-neutral-200', dot: 'text-status-missing', dotDark: 'text-neutral-400' },
  review: { label: 'Needs review', icon: '⚑', badge: 'bg-purple-50 text-purple-800 border-purple-200', dot: 'text-status-review', dotDark: 'text-purple-600' },
}

// t(id, title, coverage status, missing subtopics, keywords, pyq frequency, exam weight)
const t = (id, title, status, missing = [], keywords = [], pyqFreq = 'Frequent', weight = '7-14 Marks') => ({ id, title, status, missing, keywords, pyqFreq, weight })

// Default confidence ratings set by the student (honest personal tracking)
export const DEFAULT_CONFIDENCE_RATINGS = {
  'os-sched': 'confident',
  'os-paging': 'confident',
  'os-seg': 'shaky',
  'os-vm': 'not_started',
  'os-fs': 'not_started',
  'db-joins': 'confident',
  'db-norm': 'shaky',
  'db-acid': 'not_started',
  'ds-ll': 'confident',
  'ds-stack': 'confident',
  'ds-bst': 'shaky',
}

// Free learning sources suggested per subject.
export const OS = {
  id: 'os',
  code: 'CS304',
  title: 'Operating Systems',
  description: 'Core systems syllabus covering CPU scheduling, memory management, paging architectures, file allocation, and concurrency.',
  channels: ['Neso Academy', 'Gate Smashers', "Jenny's Lectures CS IT", 'NPTEL'],
  modules: [
    {
      id: 'os-m2',
      title: 'Module 2: Process scheduling',
      topics: [
        t('os-sched', 'CPU scheduling', 'covered', [], ['scheduling', 'cpu', 'fcfs', 'first come first served', 'shortest job', 'round robin', 'quantum', 'burst time', 'turnaround', 'waiting time'], 'Every Year (Mod 2)', '14 Marks'),
      ],
    },
    {
      id: 'os-m3',
      title: 'Module 3: Memory management',
      topics: [
        t('os-paging', 'Paging', 'covered', [], ['paging', 'page table', 'frame', 'page number', 'tlb', 'translation lookaside', 'offset', 'internal fragmentation'], 'Every Year (Mod 3)', '14 Marks'),
        t('os-seg', 'Segmentation', 'partial', ['Segment tables', 'Protection bits'], ['segmentation', 'segment', 'segment table', 'base address', 'limit', 'external fragmentation'], 'Alternate Years', '7-10 Marks'),
        t('os-vm', 'Virtual memory', 'missing', ['All subtopics'], ['virtual memory', 'demand paging', 'page fault', 'page replacement', 'lru', 'thrashing', 'swap'], 'Every Year (Mod 3)', '10-14 Marks'),
      ],
    },
    {
      id: 'os-m4',
      title: 'Module 4: File systems',
      topics: [
        t('os-fs', 'File allocation', 'review', ['Scan was unreadable'], ['file allocation', 'contiguous', 'linked allocation', 'indexed allocation', 'inode', 'disk block', 'fat'], 'Frequent', '7 Marks'),
      ],
    },
  ],
}

export const DBMS = {
  id: 'dbms',
  code: 'CS305',
  title: 'Database Management Systems',
  description: 'Relational data modeling, normal forms, transaction ACID properties, serializability, and concurrency control.',
  channels: ['Gate Smashers', 'Neso Academy', "Jenny's Lectures CS IT", 'NPTEL'],
  modules: [
    {
      id: 'db-m1',
      title: 'Module 1: Relational model',
      topics: [
        t('db-joins', 'SQL joins', 'covered', [], ['join', 'inner join', 'left join', 'outer join', 'foreign key', 'primary key']),
        t('db-norm', 'Normalization', 'partial', ['BCNF'], ['normalization', '1nf', '2nf', '3nf', 'bcnf', 'functional dependency', 'anomaly']),
      ],
    },
    {
      id: 'db-m2',
      title: 'Module 2: Transactions',
      topics: [
        t('db-acid', 'ACID and concurrency', 'missing', ['All subtopics'], ['acid', 'transaction', 'atomicity', 'isolation', 'durability', 'serializability', 'lock', 'deadlock']),
      ],
    },
  ],
}

export const DS = {
  id: 'ds',
  code: 'CS201',
  title: 'Data Structures',
  description: 'Linear arrays, linked lists, stacks, queues, binary search trees, and asymptotic algorithmic analysis.',
  channels: ["Jenny's Lectures CS IT", 'Abdul Bari', 'mycodeschool', 'NPTEL'],
  modules: [
    {
      id: 'ds-m1',
      title: 'Module 1: Linear structures',
      topics: [
        t('ds-ll', 'Linked lists', 'covered', [], ['linked list', 'node', 'pointer', 'head', 'singly', 'doubly', 'traverse']),
        t('ds-stack', 'Stacks and queues', 'covered', [], ['stack', 'queue', 'push', 'pop', 'enqueue', 'dequeue', 'lifo', 'fifo']),
      ],
    },
    {
      id: 'ds-m2',
      title: 'Module 2: Trees',
      topics: [
        t('ds-bst', 'Binary search trees', 'partial', ['Deletion'], ['binary search tree', 'bst', 'inorder', 'left subtree', 'right subtree', 'insertion', 'deletion']),
      ],
    },
  ],
}

export const CURRICULUM = [
  { id: 'btech-cse', name: 'B.Tech Computer Science', semesters: { 3: [DS], 4: [OS, DBMS] } },
  { id: 'bca', name: 'BCA', semesters: { 3: [DS] } },
]

// Standout Feature 3: Trust Passport Sample Baseline
const sampleTrust = (uploader, source, license, hashSuffix = 'a1f8') => ({
  owner: 'seed',
  visibility: 'shared',
  license: license || 'Student-authored study notes shared under Academic Honor Code',
  trust_passport: {
    uploader: uploader || 'Verified Student Contributor',
    declared_source: source || 'Lecture summaries & syllabus notes',
    permission: 'Shared for class review with author permission',
    duplicate_check: 'Passed (0 collision hashes found)',
    hash: `sha256:7f49c0d38${hashSuffix}`,
    reviewed_at: '2 days ago',
    screened_by: 'Automated Integrity Check (Client Hash)',
  },
})

// Verified Starter Resources with Real Academic Citations & Trust Passports
export const SEED_RESOURCES = [
  {
    id: 1,
    topic: 'os-paging',
    type: 'notes',
    title: 'Paging & Address Translation Architecture',
    kind: 'Typed lecture synthesis',
    source: 'Ravi (Class Rep · KTU S4 CSE)',
    checked: '19 Oct 2026',
    addedBy: 'Ravi (Class Rep · KTU S4 CSE)',
    addedAt: '2026-10-19',
    verification: 'Verified against Silberschatz OS Concepts 10th Ed Chapter 8 & KTU CST202 syllabus.',
    url: '',
    ...sampleTrust('Ravi (Class Rep)', 'Prof. Verma OS Lecture 14 & Silberschatz Ch 8', 'Original student synthesis shared under Academic Honor Code', '1a9c'),
    text: `Paging is a memory management scheme that divides a process's logical memory into fixed-size blocks called pages, and physical memory into blocks of the same size called frames. Because every page fits in any frame, the operating system can place a process's pages anywhere in memory, so external fragmentation is avoided.

A logical address is split into a page number (p) and an offset (d). The page number indexes the page table to find the corresponding frame number (f), and the offset is concatenated or added to the frame's base address to reach the exact physical byte in RAM. Each process has its own page table stored in main memory.

Looking up the page table in memory doubles the cost of every access (one for page table entry, one for actual memory operand). To eliminate this bottleneck, modern CPUs provide a high-speed hardware associative cache called the Translation Lookaside Buffer (TLB). A TLB hit yields the physical frame number in ~1ns, while a miss falls back to the in-memory page table.

The last page of a process rarely fills the entire frame capacity, leaving unused memory inside that frame. This is called internal fragmentation. If frame size is 4 KB, the expected average internal fragmentation per process is 2 KB. Smaller pages waste less space but increase page table size.`,
  },
  {
    id: 2,
    topic: 'os-paging',
    type: 'videos',
    title: 'Operating System Fundamentals · NPTEL / IIT Kharagpur',
    kind: 'NPTEL Official Video Course',
    source: 'Prof. Santanu Chattopadhyay (IIT Kharagpur)',
    checked: '19 Oct 2026',
    addedBy: 'Syllabus Hub curator',
    addedAt: '2026-10-19',
    verification: 'Official NPTEL course page (Course ID: 106105214); covers virtual memory, demand paging, and TLB.',
    url: 'https://nptel.ac.in/courses/106105214',
    ...sampleTrust('NPTEL / IIT Kharagpur', 'NPTEL Computer Science Curriculum', 'Free Public Academic Resource', '2b8d'),
  },
  {
    id: 3,
    topic: 'os-paging',
    type: 'videos',
    title: 'Paging in Operating Systems (Gate Smashers)',
    kind: 'YouTube Lecture',
    source: 'Varun Singla (Gate Smashers)',
    checked: '19 Oct 2026',
    addedBy: 'Varun Singla',
    addedAt: '2026-10-19',
    verification: 'High-clarity video walkthrough of paging address translation, page tables, and memory mapping.',
    url: 'https://www.youtube.com/watch?v=pJ6qrCB8pDw',
    ...sampleTrust('Gate Smashers Team', 'Public YouTube educational video', 'Creative Commons / YouTube Standard', '3c7e'),
  },
  {
    id: 4,
    topic: 'os-paging',
    type: 'code',
    title: 'Paging & TLB Simulation in C (OSTEP Codebase)',
    kind: 'GitHub Open Source Repository',
    source: 'Prof. Remzi Arpaci-Dusseau (Univ. of Wisconsin-Madison)',
    checked: '19 Oct 2026',
    addedBy: 'Prof. Remzi Arpaci-Dusseau',
    addedAt: '2026-10-19',
    verification: 'Working C code simulating multi-level page table lookups, TLB hit rates, and trace replays.',
    url: 'https://github.com/remzi-arpacidusseau/ostep-code/tree/master/vm-paging',
    ...sampleTrust('Prof. Remzi Arpaci-Dusseau', 'OSTEP textbook code repository', 'GPL v2 Open Source', '4d6f'),
  },
  {
    id: 5,
    topic: 'os-paging',
    type: 'textbook',
    title: 'Operating System Concepts (Silberschatz 10th Ed) Chapter 8 Slides',
    kind: 'Yale CS Academic Slides',
    source: 'Silberschatz, Galvin & Gagne (Yale University)',
    checked: '19 Oct 2026',
    addedBy: 'Yale CS Archives',
    addedAt: '2026-10-19',
    verification: 'Official author-published lecture slide deck for Chapter 8: Main Memory & Paging.',
    url: 'https://codex.cs.yale.edu/avi/os-book/OS10/slide-dir/index.html',
    ...sampleTrust('Yale CS Archives', 'Course syllabus reference citation', 'Educational Fair Use Citation', '5e5a'),
  },
  {
    id: 6,
    topic: 'os-paging',
    type: 'pyqs',
    title: 'KTU Dec 2021 Exam Q3: TLB Hit Ratio & Effective Memory Access Time (Solved)',
    kind: 'Past University Exam Question & Solution',
    source: 'KTU CST202 Operating Systems Exam Archive',
    checked: '19 Oct 2026',
    addedBy: 'KTU Exam Cell Archive',
    addedAt: '2026-10-19',
    verification: 'Solved question from KTU CST202 Dec 2021 Part B (14 marks).',
    url: '',
    ...sampleTrust('KTU Exam Cell Archive', 'Past semester university question paper', 'University Public Archive', '6f4b'),
    text: `KTU CST202 Operating Systems (Dec 2021) Question 3 [14 Marks]:
a) Consider a paging system with TLB. TLB search time is 20 ns and main memory access time is 100 ns. What is the effective memory access time (EMAT) if TLB hit ratio is 85%?
b) What will be the EMAT if a 2-level paging scheme is used without TLB?

SOLUTION:
Part (a):
- Hit ratio (alpha) = 0.85
- TLB access time (t) = 20 ns
- Memory access time (m) = 100 ns
Formula: EMAT = alpha * (t + m) + (1 - alpha) * (t + 2 * m)
EMAT = 0.85 * (20 + 100) + 0.15 * (20 + 200)
EMAT = 0.85 * (120) + 0.15 * (220) = 102 + 33 = 135 ns.

Part (b):
In 2-level paging without TLB:
Every memory reference requires:
1. Lookup Outer Page Table (1 memory access)
2. Lookup Inner Page Table (1 memory access)
3. Access actual memory operand (1 memory access)
Total accesses = 3 memory accesses = 3 * 100 ns = 300 ns.`,
  },
  {
    id: 7,
    topic: 'os-seg',
    type: 'notes',
    title: 'Segmentation Architecture & Limit Trap Verification',
    kind: 'Typed lecture synthesis',
    source: 'Anu (KTU S4 CSE)',
    checked: '19 Oct 2026',
    addedBy: 'Anu (KTU S4 CSE)',
    addedAt: '2026-10-19',
    verification: 'Verified against KTU CST202 Module 3 syllabus and Silberschatz Section 8.4.',
    url: '',
    ...sampleTrust('Anu', 'Prof. Verma Memory Lecture & Silberschatz 8.4', 'Student study group notes', '8b2d'),
    text: `Segmentation is a memory-management scheme that supports a programmer-centric view of memory. A program is a collection of logical segments of variable length: Main Program, Procedures/Functions, Global Variables, Heap, and Stack.

Logical Address Structure:
A logical address consists of a two-tuple: <segment-number (s), offset (d)>.

Hardware Address Translation & Protection:
The segment number indexes the Segment Table. Each segment table entry contains:
1. Base: The starting physical address where the segment resides in memory.
2. Limit: The specified length of the segment.

Protection & Trap Mechanism:
When a memory reference is generated:
Step 1: Check if offset d < limit.
Step 2: If d >= limit, the hardware raises an addressing trap to the OS (Segmentation Fault / Memory Protection Violation).
Step 3: If d < limit, the physical address is computed as: Physical_Address = Base + d.

Comparison with Paging:
Because segments vary in length as processes allocate and deallocate memory, segmentation suffers from EXTERNAL FRAGMENTATION (free memory broken into non-contiguous holes), whereas paging eliminates external fragmentation at the cost of internal fragmentation.`,
  },
  {
    id: 8,
    topic: 'os-sched',
    type: 'notes',
    title: 'CPU Scheduling Algorithms: Criteria, Gantt Charts & Convoy Effect',
    kind: 'Typed exam summary',
    source: 'Ravi (Class Rep · KTU S4 CSE)',
    checked: '19 Oct 2026',
    addedBy: 'Ravi (Class Rep · KTU S4 CSE)',
    addedAt: '2026-10-19',
    verification: 'Verified against KTU CST202 Module 2 & Galvin Chapter 5.',
    url: '',
    ...sampleTrust('Ravi', 'Self-authored exam summary', 'Student notes shared under Academic Honor Code', '9c1e'),
    text: `CPU Scheduling decides which process in the ready queue is allocated the CPU core when the current process releases it or gets preempted.

Key Metrics:
1. Turnaround Time (TAT) = Completion Time (CT) - Arrival Time (AT)
2. Waiting Time (WT) = Turnaround Time (TAT) - Burst Time (BT)
3. Response Time (RT) = Time from arrival to first CPU allocation

Algorithms:
1. First-Come, First-Served (FCFS): Non-preemptive. Suffers from the Convoy Effect where short I/O bound processes get stuck behind a long CPU-bound process, driving down CPU and device utilization.
2. Shortest Job First (SJF): Provably optimal for minimizing average waiting time. Difficult to implement in pure form because future CPU burst time cannot be known with certainty. Preemptive SJF is known as Shortest Remaining Time First (SRTF). Long jobs can suffer starvation.
3. Round Robin (RR): Preemptive with a fixed time quantum (q). Fair and responsive for time-sharing systems. If q is very large, RR degenerates into FCFS; if q is extremely small, context-switching overhead dominates.`,
  },
  {
    id: 9,
    topic: 'db-joins',
    type: 'videos',
    title: 'Introduction to Database Systems · NPTEL / IIT Madras',
    kind: 'NPTEL Official Video Course',
    source: 'Prof. S. Sudarshan (IIT Bombay) / NPTEL',
    checked: '19 Oct 2026',
    addedBy: 'Syllabus Hub curator',
    addedAt: '2026-10-19',
    verification: 'Official NPTEL course page (Course ID: 106106220); covers relational algebra, joins, and SQL.',
    url: 'https://nptel.ac.in/courses/106106220',
    ...sampleTrust('NPTEL / IIT Madras', 'NPTEL Database Curriculum', 'Free Public Academic Resource', '0d0f'),
  },
  {
    id: 10,
    topic: 'db-joins',
    type: 'notes',
    title: 'Relational Joins, Cross Products & Null Semantics',
    kind: 'Typed lab notes',
    source: 'Meera (KTU S4 CSE)',
    checked: '19 Oct 2026',
    addedBy: 'Meera (KTU S4 CSE)',
    addedAt: '2026-10-19',
    verification: 'Verified against KTU CST204 Database Management Systems Module 1 & 2.',
    url: '',
    ...sampleTrust('Meera', 'Database lab notes & Silberschatz DBMS Ch 3', 'Student notes shared under Academic Honor Code', '1e1a'),
    text: `A JOIN operation combines tuples from two or more relations based on a common joining condition.

Types of Joins:
1. INNER JOIN: Returns only tuples that satisfy the join predicate in both tables. Tuples without matches in the other table are omitted.
2. LEFT OUTER JOIN: Returns all tuples from the left relation, plus matched attributes from the right relation. For left tuples with no right match, right-side columns are filled with NULL.
3. RIGHT OUTER JOIN: Returns all tuples from the right relation, padding left-side missing values with NULL.
4. FULL OUTER JOIN: Retains all tuples from both relations, padding unmatched attributes with NULL on either side.
5. NATURAL JOIN: Matches tuples based on all attributes with identical names in both relations, projecting out duplicate column names.

Cartesian Product (Cross Join): Produces R x S tuples where each row of R is paired with every row of S. An equi-join is equivalent to a Cartesian Product followed by a selection on equality of joining attributes.`,
  },
  {
    id: 11,
    topic: 'ds-ll',
    type: 'videos',
    title: 'Data Structures and Algorithms · NPTEL / IIT Delhi',
    kind: 'NPTEL Official Video Course',
    source: 'Prof. Naveen Garg (IIT Delhi)',
    checked: '19 Oct 2026',
    addedBy: 'Syllabus Hub curator',
    addedAt: '2026-10-19',
    verification: 'Official NPTEL course page (Course ID: 106102064); authoritative lectures on linear structures, pointers, and memory layout.',
    url: 'https://nptel.ac.in/courses/106102064',
    ...sampleTrust('NPTEL / IIT Delhi', 'NPTEL DSA Curriculum', 'Free Public Academic Resource', '2f2b'),
  },
]

// Standout Feature 5: Misconception Map Data for Class Cohort
export const CLASS_MISCONCEPTIONS = [
  {
    id: 'misc-1',
    topicId: 'os-seg',
    topicTitle: 'Segmentation',
    subjectId: 'os',
    concept: 'Segment Offset vs Limit Trap',
    incorrectRate: 64,
    studentsCount: 48,
    pitfall: '64% of class answers mistakenly add the segment offset to the limit instead of checking (offset >= limit).',
    recommendation: 'Review Hardware Address Translation in Segmentation: The hardware validates `d < limit` before generating `physical_address = base + d`. If `d >= limit`, an illegal access trap is raised.',
    sourceCitation: 'Silberschatz Chapter 8.4: Segmentation Hardware Architecture',
  },
  {
    id: 'misc-2',
    topicId: 'os-paging',
    topicTitle: 'Paging',
    subjectId: 'os',
    concept: 'TLB Miss Access Overhead in Multi-Level Paging',
    incorrectRate: 58,
    studentsCount: 43,
    pitfall: '58% of students forget that a 2-level page table requires TWO memory accesses on a TLB miss before accessing the actual data.',
    recommendation: 'Effective Memory Access Time (EMAT) formula: `EMAT = Hit_Ratio * (TLB_time + Mem_time) + (1 - Hit_Ratio) * (TLB_time + (Levels + 1) * Mem_time)`.',
    sourceCitation: '2021 Exam Q3 Solution Guide & Lecture 14 Notes',
  },
  {
    id: 'misc-3',
    topicId: 'os-sched',
    topicTitle: 'CPU scheduling',
    subjectId: 'os',
    concept: 'Convoy Effect vs Starvation',
    incorrectRate: 42,
    studentsCount: 31,
    pitfall: 'Confusing the Convoy Effect (FCFS performance bottleneck when CPU-bound process blocks I/O-bound processes) with Starvation (SJF indefinitely postponing long jobs).',
    recommendation: 'FCFS processes never starve because queue is strictly FIFO; but short processes suffer Convoy latency.',
    sourceCitation: 'Scheduling Algorithms Notes (Ravi) Section 2',
  },
  {
    id: 'misc-4',
    topicId: 'os-vm',
    topicTitle: 'Virtual memory',
    subjectId: 'os',
    concept: 'Thrashing & Working Set Window',
    incorrectRate: 78,
    studentsCount: 59,
    pitfall: '78% of responses cannot identify the threshold where page replacement paging overhead exceeds productive CPU execution time.',
    recommendation: 'Missing topic in your notes! Add notes on Working Set Model and Page Fault Frequency algorithm.',
    sourceCitation: 'Syllabus Gap Recovery: Virtual Memory',
  },
]

// Standout Feature 7: Grounded Practice Questions per Topic
export const TOPIC_PRACTICE_QUESTIONS = {
  'os-seg': [
    {
      id: 'q-seg-1',
      question: 'Why does segmentation cause external fragmentation whereas paging causes internal fragmentation?',
      options: [
        'Segments are variable in length while pages and frames are fixed in size',
        'Segments do not use hardware base registers for relocation',
        'Paging translates physical addresses while segmentation does not',
        'Segment tables cannot be stored in RAM',
      ],
      correctIndex: 0,
      explanation: 'Because segments are variable length logical blocks (code, heap, stack), memory allocations leave unused gaps between allocated segments (external fragmentation). Paging uses fixed blocks, so waste only occurs inside the final allocated page (internal fragmentation).',
      sourceSnippet: 'Segmentation summary: "Because segments vary in size, segmentation can cause external fragmentation."',
    },
    {
      id: 'q-seg-2',
      question: 'In segmentation hardware translation, what happens when a logical address specifies an offset greater than the segment limit?',
      options: [
        'The offset wraps around to zero modulo limit',
        'The hardware raises a memory protection violation trap',
        'The OS automatically expands the physical memory segment',
        'The hardware redirects the access to swap space',
      ],
      correctIndex: 1,
      explanation: 'If `offset >= limit`, the hardware generates an addressing trap to the operating system, terminating the rogue process with a segmentation fault.',
      sourceSnippet: 'Segmentation summary: "If the offset is greater than the limit, the hardware raises a trap."',
    },
  ],
  'os-paging': [
    {
      id: 'q-paging-1',
      question: 'Given a 32-bit virtual address and a 4KB page size, how many bits represent the page offset within a frame?',
      options: ['10 bits', '12 bits', '20 bits', '32 bits'],
      correctIndex: 1,
      explanation: 'Since 4KB = 4096 bytes = 2^12 bytes, exactly 12 bits are needed to index the offset. The remaining 20 bits index the page table.',
      sourceSnippet: 'Paging notes: "A logical address is split into a page number and an offset."',
    },
    {
      id: 'q-paging-2',
      question: 'What is the primary role of the Translation Lookaside Buffer (TLB) in paging hardware?',
      options: [
        'To store the entire virtual memory swap file',
        'To cache recent page-to-frame translations to avoid extra RAM lookups',
        'To calculate internal fragmentation inside frames',
        'To encrypt user addresses before accessing bus lines',
      ],
      correctIndex: 1,
      explanation: 'A TLB is a fast hardware associative cache that stores the most recently used page table entries. On a TLB hit, the frame number is returned in a few nanoseconds without needing to query RAM.',
      sourceSnippet: 'Paging notes: "A TLB hit returns the frame number immediately, while a miss falls back to the page table."',
    },
  ],
  'os-sched': [
    {
      id: 'q-sched-1',
      question: 'Which CPU scheduling algorithm gives the minimum theoretical average waiting time for a given set of processes?',
      options: ['First Come First Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Priority Scheduling'],
      correctIndex: 2,
      explanation: 'Shortest Job First (SJF) is provably optimal for minimizing average waiting time, but requires knowing the future CPU burst time in advance.',
      sourceSnippet: 'Scheduling algorithms: "Shortest job first minimises average waiting time but needs the burst time in advance."',
    },
  ],
}
