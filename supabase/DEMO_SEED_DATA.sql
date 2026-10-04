-- ============================================================================
-- KNOWLEDGE CANVAS - MEANINGFUL PRODUCTION-GRADE DEMO SEED DATA
-- ============================================================================
-- Description:
-- Populates rich, realistic Question Banks, MCQs, Tests, and Completed Attempts
-- for all registered users in auth.users (or a specific user).
--
-- Features included:
-- 1. Three Realistic Question Banks (Full-Stack, System Architecture, Cloud/DevOps)
-- 2. 16 In-depth MCQs with 4 distinct options, correct answers, and full explanations
-- 3. Realistic Test configurations (timed, randomized, mixed difficulties)
-- 4. Completed Test Attempts & Question Answers (populating Dashboard Analytics & Accuracy)
--
-- Safe & Idempotent: Checks for existing data so you can run it safely without duplicates.
-- ============================================================================

DO $$
DECLARE
    r_user RECORD;
    v_user_count INTEGER := 0;

    -- Bank IDs
    v_bank1_id UUID;
    v_bank2_id UUID;
    v_bank3_id UUID;

    -- Question IDs for Bank 1 (React & Web)
    v_q1 UUID; v_q2 UUID; v_q3 UUID; v_q4 UUID; v_q5 UUID; v_q6 UUID;
    -- Question IDs for Bank 2 (System Design)
    v_q7 UUID; v_q8 UUID; v_q9 UUID; v_q10 UUID; v_q11 UUID; v_q12 UUID;
    -- Question IDs for Bank 3 (Cloud & DevOps)
    v_q13 UUID; v_q14 UUID; v_q15 UUID; v_q16 UUID;

    -- Test IDs
    v_test1_id UUID;
    v_test2_id UUID;

    -- Test Question IDs
    v_tq1 UUID; v_tq2 UUID; v_tq3 UUID; v_tq4 UUID;
    v_tq5 UUID; v_tq6 UUID; v_tq7 UUID; v_tq8 UUID;

    -- Attempt IDs
    v_att1_id UUID;
    v_att2_id UUID;
BEGIN
    -- Check if any user exists in auth.users
    SELECT COUNT(*) INTO v_user_count FROM auth.users;
    
    IF v_user_count = 0 THEN
        RAISE NOTICE '⚠️ No users found in auth.users! Please sign up or log in first, then re-run this script.';
        RETURN;
    END IF;

    -- Iterate over each registered user so every reviewer/account sees meaningful data
    FOR r_user IN SELECT id, email FROM auth.users LOOP
        RAISE NOTICE '🚀 Seeding rich demo data for: % (ID: %)', r_user.email, r_user.id;

        -- --------------------------------------------------------------------
        -- 1. QUESTION BANK 1: Full-Stack Web & React Engineering
        -- --------------------------------------------------------------------
        SELECT id INTO v_bank1_id FROM public.question_banks 
        WHERE user_id = r_user.id AND name = 'Full-Stack Web & React Engineering' LIMIT 1;

        IF v_bank1_id IS NULL THEN
            v_bank1_id := gen_random_uuid();
            INSERT INTO public.question_banks (id, user_id, name, description, subject, topic, created_at, updated_at)
            VALUES (
                v_bank1_id,
                r_user.id,
                'Full-Stack Web & React Engineering',
                'Comprehensive MCQ bank evaluating React 19 architecture, Server Components, Concurrent Mode, and web performance optimization.',
                'Software Engineering',
                'React & Modern Web',
                NOW() - INTERVAL '3 days',
                NOW() - INTERVAL '3 days'
            );

            -- Questions for Bank 1
            v_q1 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q1, v_bank1_id,
                'In React 19, what is the primary architectural difference between Server Components (RSC) and standard Client Components?',
                'Server Components run strictly on the server and ship zero JavaScript bundle to the browser client.',
                'Server Components are re-executed on every client-side state update.',
                'Client Components cannot use any browser APIs like window or localStorage.',
                'Server Components require all child components to also be Server Components.',
                'A',
                'React Server Components (RSC) render exclusively on the server and stream serialized UI elements (React Flight protocol) to the client, effectively adding 0 kB of JavaScript to the client bundle.',
                'medium', 'React 19 & Architecture', 'React 19 Documentation', NOW() - INTERVAL '3 days'
            );

            v_q2 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q2, v_bank1_id,
                'What is the core benefit of using React''s useTransition hook for UI state transitions?',
                'It completely prevents all component re-renders until an async operation settles.',
                'It marks state updates as non-blocking transitions, keeping user interactions like typing responsive.',
                'It replaces Redux and Zustand by maintaining global reactive caches.',
                'It forces the browser main thread to execute high-priority garbage collection immediately.',
                'B',
                'useTransition enables developers to mark UI state changes as non-urgent transitions so that urgent inputs (clicks, keypresses) stay completely responsive without UI freezing.',
                'medium', 'React 19 & Architecture', 'Concurrent React Specifications', NOW() - INTERVAL '3 days'
            );

            v_q3 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q3, v_bank1_id,
                'In TanStack Query (React Query), what is the key functional difference between staleTime and gcTime (formerly cacheTime)?',
                'staleTime determines when cached data is considered fresh, while gcTime determines how long unused data remains in memory.',
                'staleTime controls garbage collection while gcTime controls refetch intervals.',
                'staleTime only applies to mutations, whereas gcTime applies to standard queries.',
                'They are aliases for the same configuration setting.',
                'A',
                'staleTime specifies the duration after which data is considered stale (triggering background refetches). gcTime determines how long inactive query data stays stored in memory before garbage collection.',
                'hard', 'Data Fetching & State', 'TanStack Query v5 Specs', NOW() - INTERVAL '3 days'
            );

            v_q4 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q4, v_bank1_id,
                'How does HTTP/3 (QUIC) effectively solve the Head-of-Line (HoL) blocking problem present in HTTP/2?',
                'By compressing headers using the HPACK dictionary algorithm.',
                'By running over UDP with independent streams where packet loss on one stream does not pause other streams.',
                'By establishing separate TCP handshakes for each concurrent network asset.',
                'By executing server pushes asynchronously without client acknowledgement.',
                'B',
                'HTTP/2 multiplexes over a single TCP stream, so any TCP packet drop halts all streams (TCP-level HoL blocking). HTTP/3 uses QUIC over UDP, ensuring stream isolation where loss only delays the affected stream.',
                'hard', 'Web Performance & Networking', 'RFC 9000 (QUIC)', NOW() - INTERVAL '3 days'
            );

            v_q5 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q5, v_bank1_id,
                'When does the useLayoutEffect hook execute relative to the browser DOM mutation and screen paint?',
                'Asynchronously after the browser has completed the paint cycle.',
                'Synchronously after DOM mutations but before the browser paints to the screen.',
                'Before the virtual DOM reconciliation process begins.',
                'Only when the component is unmounted from the DOM hierarchy.',
                'B',
                'useLayoutEffect fires synchronously immediately after React mutates the DOM, allowing layout measurements to be read and synchronously adjusted before the browser paints the pixels.',
                'easy', 'React 19 & Architecture', 'React Core Mechanics', NOW() - INTERVAL '3 days'
            );

            v_q6 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q6, v_bank1_id,
                'In Supabase PostgreSQL, why is Row Level Security (RLS) preferred over filtering in frontend API calls?',
                'Frontend filters can easily be bypassed by intercepting or executing custom API requests directly against the REST endpoint.',
                'PostgreSQL does not permit WHERE clauses in client-initiated REST queries.',
                'RLS automatically eliminates the need for database indexes.',
                'Frontend filtering consumes significantly more server memory than RLS policies.',
                'A',
                'Frontend filters provide zero security because any user can craft direct HTTP calls with the publishable key. RLS enforces security rules directly inside the PostgreSQL database engine.',
                'easy', 'Backend & Security', 'Supabase Security Guide', NOW() - INTERVAL '3 days'
            );
        END IF;

        -- --------------------------------------------------------------------
        -- 2. QUESTION BANK 2: System Architecture & Distributed Systems
        -- --------------------------------------------------------------------
        SELECT id INTO v_bank2_id FROM public.question_banks 
        WHERE user_id = r_user.id AND name = 'System Architecture & Distributed Systems' LIMIT 1;

        IF v_bank2_id IS NULL THEN
            v_bank2_id := gen_random_uuid();
            INSERT INTO public.question_banks (id, user_id, name, description, subject, topic, created_at, updated_at)
            VALUES (
                v_bank2_id,
                r_user.id,
                'System Architecture & Distributed Systems',
                'Core concepts covering distributed consensus, CAP theorem, database partitioning, indexing, and high-throughput caching.',
                'Computer Science',
                'Distributed Systems',
                NOW() - INTERVAL '2 days',
                NOW() - INTERVAL '2 days'
            );

            v_q7 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q7, v_bank2_id,
                'According to the CAP theorem, what trade-off must a distributed system make when a network partition (P) inevitably occurs?',
                'The system must choose between Consistency (C) and Availability (A).',
                'The system must sacrifice Partition Tolerance (P) to maintain both C and A.',
                'The system can maintain C, A, and P simultaneously by utilizing Paxos consensus.',
                'The system must disable all read operations until the partition resolves.',
                'A',
                'When a network partition (P) occurs, nodes cannot communicate. The system must choose either to return stale data (Availability) or return an error/timeout until synchronized (Consistency).',
                'medium', 'CAP & Consensus', 'Brewer''s CAP Theorem', NOW() - INTERVAL '2 days'
            );

            v_q8 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q8, v_bank2_id,
                'Why are Log-Structured Merge (LSM) Trees preferred over traditional B-Trees in write-intensive database engines (like Cassandra or RocksDB)?',
                'LSM Trees avoid random disk writes by appending sequentially to in-memory memtables and WAL before flushing to SSTables.',
                'B-Trees cannot support range queries or binary search operations.',
                'LSM Trees guarantee constant O(1) point read latency without bloom filters.',
                'B-Trees require hardware GPU acceleration to compute leaf node balances.',
                'A',
                'LSM-Trees convert random writes into sequential writes in memory and append-only disk logs, delivering significantly higher write throughput than in-place B-Tree page modifications.',
                'hard', 'Databases & Storage', 'Database Internals by Alex Petrov', NOW() - INTERVAL '2 days'
            );

            v_q9 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q9, v_bank2_id,
                'What is the primary advantage of using Consistent Hashing in a distributed caching cluster with multiple cache nodes?',
                'Adding or removing a server node only requires remapping K/N keys rather than all keys.',
                'It completely eliminates hash collisions across 64-bit integer ranges.',
                'It forces cache eviction to always follow strict LFU ordering.',
                'It guarantees linear cryptographic encryption of cache payloads.',
                'A',
                'With traditional modulo hashing (hash(key) % N), changing N causes almost all keys to remap. Consistent Hashing places nodes and keys on a circular ring, minimizing remapping to K/N on topology changes.',
                'hard', 'Distributed Caching', 'Karger et al. (MIT)', NOW() - INTERVAL '2 days'
            );

            v_q10 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q10, v_bank2_id,
                'In the SAGA pattern for distributed microservice transactions, how is atomicity maintained without a distributed two-phase commit (2PC)?',
                'By executing compensating transactions in reverse order if any local transaction step fails.',
                'By locking database records across all participating microservices simultaneously.',
                'By holding open HTTP keep-alive connections until all services respond.',
                'By rolling back database transactions automatically through a centralized global lock manager.',
                'A',
                'A SAGA coordinates a sequence of local transactions. If any step fails, the coordinator triggers compensating transactions that semantically undo the changes made by preceding steps.',
                'medium', 'Microservices Patterns', 'Enterprise Integration Patterns', NOW() - INTERVAL '2 days'
            );

            v_q11 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q11, v_bank2_id,
                'What is the fundamental difference between the Cache-Aside (Lazy Loading) pattern and the Write-Through caching pattern?',
                'In Cache-Aside, the application directly queries the cache and loads from DB on miss; in Write-Through, writes update the cache and DB synchronously.',
                'Cache-Aside always writes directly to disk before caching in RAM.',
                'Write-Through never guarantees cache consistency on concurrent writes.',
                'Cache-Aside requires database triggers to write cache values.',
                'A',
                'In Cache-Aside, the app manages reads/writes directly. In Write-Through, the cache acts as the main data store interface, synchronously writing to the underlying database.',
                'easy', 'Distributed Caching', 'System Design Primer', NOW() - INTERVAL '2 days'
            );

            v_q12 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q12, v_bank2_id,
                'In Apache Kafka, what determines the maximum degree of message consumption parallelism within a single Consumer Group?',
                'The number of partitions in the subscribed topic.',
                'The total number of consumer threads created in the application JVM.',
                'The network bandwidth of the Kafka broker leader.',
                'The size of the consumer fetch buffer in megabytes.',
                'A',
                'Each partition in a Kafka topic can only be consumed by at most one consumer instance within a specific consumer group, making the partition count the absolute concurrency ceiling.',
                'medium', 'Event Streaming', 'Kafka Architecture Guide', NOW() - INTERVAL '2 days'
            );
        END IF;

        -- --------------------------------------------------------------------
        -- 3. QUESTION BANK 3: Cloud Infrastructure & DevOps
        -- --------------------------------------------------------------------
        SELECT id INTO v_bank3_id FROM public.question_banks 
        WHERE user_id = r_user.id AND name = 'Cloud Infrastructure & DevOps' LIMIT 1;

        IF v_bank3_id IS NULL THEN
            v_bank3_id := gen_random_uuid();
            INSERT INTO public.question_banks (id, user_id, name, description, subject, topic, created_at, updated_at)
            VALUES (
                v_bank3_id,
                r_user.id,
                'Cloud Infrastructure & DevOps',
                'Production containerization, Kubernetes cluster operations, continuous deployment strategies, and infrastructure reliability.',
                'Cloud Engineering',
                'Containers & CI/CD',
                NOW() - INTERVAL '1 day',
                NOW() - INTERVAL '1 day'
            );

            v_q13 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q13, v_bank3_id,
                'What is the primary security and efficiency benefit of Docker Multi-Stage builds?',
                'Build-time SDKs and compilers are excluded from the final runtime image, drastically reducing attack surface and image size.',
                'It allows Docker containers to bypass kernel namespace isolation.',
                'It parallelizes container execution across multiple physical host CPU sockets.',
                'It removes the need for SSL certificates in production ingress controllers.',
                'A',
                'Multi-stage builds permit heavy tooling (Node, Rust, Go compilers) to run in intermediate stages, copying only compiled production artifacts into a minimal scratch or alpine image.',
                'easy', 'Containers & CI/CD', 'Docker Best Practices', NOW() - INTERVAL '1 day'
            );

            v_q14 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q14, v_bank3_id,
                'In Kubernetes, what is the functional difference between a Liveness Probe and a Readiness Probe?',
                'Liveness probes restart a dead/hung container; Readiness probes determine if the container is ready to receive network traffic from a Service.',
                'Liveness probes verify network security while Readiness probes inspect storage volumes.',
                'Both probes execute the exact same container restarts on failure.',
                'Readiness probes run strictly on worker nodes, while Liveness probes execute on the control plane.',
                'A',
                'If a Liveness probe fails, kubelet kills and restarts the container. If a Readiness probe fails, the Pod is simply removed from the Service endpoints so no requests are routed to it.',
                'medium', 'Containers & CI/CD', 'Kubernetes Architecture Docs', NOW() - INTERVAL '1 day'
            );

            v_q15 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q15, v_bank3_id,
                'What characterizes a Canary Deployment release strategy compared to a Blue-Green deployment?',
                'Traffic is incrementally shifted to the new version (e.g. 5%, 25%, 100%) to observe telemetry and errors before full rollout.',
                'Canary deployment requires two identical full-capacity production environments at all times.',
                'Canary deployments require complete downtime during DNS propagation.',
                'Blue-green deployments always expose real users to unmonitored beta builds.',
                'A',
                'Canary releases direct a small fraction of real production traffic to the new revision while monitoring metrics for regressions, rolling back immediately if anomalies occur.',
                'easy', 'Containers & CI/CD', 'Continuous Delivery Handbook', NOW() - INTERVAL '1 day'
            );

            v_q16 := gen_random_uuid();
            INSERT INTO public.questions (id, question_bank_id, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, difficulty, topic, source_reference, created_at)
            VALUES (
                v_q16, v_bank3_id,
                'When executing zero-downtime database schema changes in production, which rule should strictly be followed?',
                'Make backward-compatible additive changes first (Expand and Contract pattern) before removing old columns.',
                'Lock all database tables with exclusive write locks during migration.',
                'Drop deprecated columns immediately so application code can be refactored.',
                'Rename existing columns directly in the production database during peak hours.',
                'A',
                'The Expand-Contract (Parallel Run) pattern adds new columns/tables first, updates application code to write to both, backfills data, and only removes the old structure once all running pods are updated.',
                'hard', 'Databases & Storage', 'Refactoring Databases (Pramod Sadalage)', NOW() - INTERVAL '1 day'
            );
        END IF;

        -- --------------------------------------------------------------------
        -- 4. REALISTIC TEST 1: React 19 & Full-Stack Certification Test
        -- --------------------------------------------------------------------
        SELECT id INTO v_test1_id FROM public.tests 
        WHERE user_id = r_user.id AND title = 'React 19 & Full-Stack Core Test' LIMIT 1;

        IF v_test1_id IS NULL AND v_bank1_id IS NOT NULL THEN
            v_test1_id := gen_random_uuid();
            INSERT INTO public.tests (
                id, user_id, question_bank_id, title, mode, total_questions, difficulty, topic,
                timer_enabled, duration_seconds, randomize_questions, randomize_options, created_at, updated_at
            ) VALUES (
                v_test1_id, r_user.id, v_bank1_id, 'React 19 & Full-Stack Core Test', 'custom', 4, 'mixed', 'React 19 & Architecture',
                true, 600, false, false, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
            );

            -- Test Questions
            v_tq1 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq1, v_test1_id, v_q1, 1, 'In React 19, what is the primary architectural difference between Server Components (RSC) and standard Client Components?',
                    'Server Components run strictly on the server and ship zero JavaScript bundle to the browser client.', 'Server Components are re-executed on every client-side state update.', 'Client Components cannot use any browser APIs like window or localStorage.', 'Server Components require all child components to also be Server Components.', 'A', 'RSC runs on the server and ships 0 kB JS to the client.', 'React 19 & Architecture', 'medium');

            v_tq2 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq2, v_test1_id, v_q2, 2, 'What is the core benefit of using React''s useTransition hook for UI state transitions?',
                    'It completely prevents all component re-renders until an async operation settles.', 'It marks state updates as non-blocking transitions, keeping user interactions like typing responsive.', 'It replaces Redux and Zustand by maintaining global reactive caches.', 'It forces the browser main thread to execute high-priority garbage collection immediately.', 'B', 'Marks updates as non-blocking transitions.', 'React 19 & Architecture', 'medium');

            v_tq3 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq3, v_test1_id, v_q3, 3, 'In TanStack Query (React Query), what is the key functional difference between staleTime and gcTime (formerly cacheTime)?',
                    'staleTime determines when cached data is considered fresh, while gcTime determines how long unused data remains in memory.', 'staleTime controls garbage collection while gcTime controls refetch intervals.', 'staleTime only applies to mutations, whereas gcTime applies to standard queries.', 'They are aliases for the same configuration setting.', 'A', 'staleTime = freshness, gcTime = memory retention.', 'Data Fetching & State', 'hard');

            v_tq4 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq4, v_test1_id, v_q4, 4, 'How does HTTP/3 (QUIC) effectively solve the Head-of-Line (HoL) blocking problem present in HTTP/2?',
                    'By compressing headers using the HPACK dictionary algorithm.', 'By running over UDP with independent streams where packet loss on one stream does not pause other streams.', 'By establishing separate TCP handshakes for each concurrent network asset.', 'By executing server pushes asynchronously without client acknowledgement.', 'B', 'QUIC over UDP prevents stream-blocking packet loss.', 'Web Performance & Networking', 'hard');

            -- Completed Attempt 1: Score 75% (3/4 correct)
            v_att1_id := gen_random_uuid();
            INSERT INTO public.attempts (
                id, test_id, user_id, status, started_at, submitted_at, time_spent_seconds,
                total_questions, answered_questions, correct_answers, incorrect_answers, unanswered_questions,
                score, percentage, created_at, updated_at
            ) VALUES (
                v_att1_id, v_test1_id, r_user.id, 'completed',
                NOW() - INTERVAL '2 days' - INTERVAL '5 minutes',
                NOW() - INTERVAL '2 days',
                284, 4, 4, 3, 1, 0, 75.0, 75.0,
                NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
            );

            -- Attempt answers
            INSERT INTO public.attempt_answers (attempt_id, test_question_id, selected_answer, is_correct, is_marked_for_review, answered_at)
            VALUES
                (v_att1_id, v_tq1, 'A', true, false, NOW() - INTERVAL '2 days' - INTERVAL '4 minutes'),
                (v_att1_id, v_tq2, 'B', true, false, NOW() - INTERVAL '2 days' - INTERVAL '3 minutes'),
                (v_att1_id, v_tq3, 'A', true, false, NOW() - INTERVAL '2 days' - INTERVAL '2 minutes'),
                (v_att1_id, v_tq4, 'C', false, true, NOW() - INTERVAL '2 days' - INTERVAL '1 minute');
        END IF;

        -- --------------------------------------------------------------------
        -- 5. REALISTIC TEST 2: Distributed Systems Core Evaluation
        -- --------------------------------------------------------------------
        SELECT id INTO v_test2_id FROM public.tests 
        WHERE user_id = r_user.id AND title = 'Distributed Systems & Storage Assessment' LIMIT 1;

        IF v_test2_id IS NULL AND v_bank2_id IS NOT NULL THEN
            v_test2_id := gen_random_uuid();
            INSERT INTO public.tests (
                id, user_id, question_bank_id, title, mode, total_questions, difficulty, topic,
                timer_enabled, duration_seconds, randomize_questions, randomize_options, created_at, updated_at
            ) VALUES (
                v_test2_id, r_user.id, v_bank2_id, 'Distributed Systems & Storage Assessment', 'custom', 4, 'hard', 'Distributed Systems',
                true, 720, false, false, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
            );

            -- Test Questions
            v_tq5 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq5, v_test2_id, v_q7, 1, 'According to the CAP theorem, what trade-off must a distributed system make when a network partition (P) inevitably occurs?',
                    'The system must choose between Consistency (C) and Availability (A).', 'The system must sacrifice Partition Tolerance (P) to maintain both C and A.', 'The system can maintain C, A, and P simultaneously by utilizing Paxos consensus.', 'The system must disable all read operations until the partition resolves.', 'A', 'Pick either C or A during partitions.', 'CAP & Consensus', 'medium');

            v_tq6 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq6, v_test2_id, v_q8, 2, 'Why are Log-Structured Merge (LSM) Trees preferred over traditional B-Trees in write-intensive database engines (like Cassandra or RocksDB)?',
                    'LSM Trees avoid random disk writes by appending sequentially to in-memory memtables and WAL before flushing to SSTables.', 'B-Trees cannot support range queries or binary search operations.', 'LSM Trees guarantee constant O(1) point read latency without bloom filters.', 'B-Trees require hardware GPU acceleration to compute leaf node balances.', 'A', 'LSM converts random writes into sequential writes.', 'Databases & Storage', 'hard');

            v_tq7 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq7, v_test2_id, v_q9, 3, 'What is the primary advantage of using Consistent Hashing in a distributed caching cluster with multiple cache nodes?',
                    'Adding or removing a server node only requires remapping K/N keys rather than all keys.', 'It completely eliminates hash collisions across 64-bit integer ranges.', 'It forces cache eviction to always follow strict LFU ordering.', 'It guarantees linear cryptographic encryption of cache payloads.', 'A', 'Remaps only K/N keys upon cluster change.', 'Distributed Caching', 'hard');

            v_tq8 := gen_random_uuid();
            INSERT INTO public.test_questions (id, test_id, original_question_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, topic, difficulty)
            VALUES (v_tq8, v_test2_id, v_q10, 4, 'In the SAGA pattern for distributed microservice transactions, how is atomicity maintained without a distributed two-phase commit (2PC)?',
                    'By executing compensating transactions in reverse order if any local transaction step fails.', 'By locking database records across all participating microservices simultaneously.', 'By holding open HTTP keep-alive connections until all services respond.', 'By rolling back database transactions automatically through a centralized global lock manager.', 'A', 'Compensating transactions undo prior completed steps.', 'Microservices Patterns', 'medium');

            -- Completed Attempt 2: Score 100% (4/4 correct)
            v_att2_id := gen_random_uuid();
            INSERT INTO public.attempts (
                id, test_id, user_id, status, started_at, submitted_at, time_spent_seconds,
                total_questions, answered_questions, correct_answers, incorrect_answers, unanswered_questions,
                score, percentage, created_at, updated_at
            ) VALUES (
                v_att2_id, v_test2_id, r_user.id, 'completed',
                NOW() - INTERVAL '1 day' - INTERVAL '6 minutes',
                NOW() - INTERVAL '1 day',
                340, 4, 4, 4, 0, 0, 100.0, 100.0,
                NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
            );

            -- Attempt answers
            INSERT INTO public.attempt_answers (attempt_id, test_question_id, selected_answer, is_correct, is_marked_for_review, answered_at)
            VALUES
                (v_att2_id, v_tq5, 'A', true, false, NOW() - INTERVAL '1 day' - INTERVAL '5 minutes'),
                (v_att2_id, v_tq6, 'A', true, false, NOW() - INTERVAL '1 day' - INTERVAL '4 minutes'),
                (v_att2_id, v_tq7, 'A', true, false, NOW() - INTERVAL '1 day' - INTERVAL '3 minutes'),
                (v_att2_id, v_tq8, 'A', true, false, NOW() - INTERVAL '1 day' - INTERVAL '1 minute');
        END IF;

    END LOOP;

    RAISE NOTICE '✅ Production demo dataset seeded successfully!';
END $$;
