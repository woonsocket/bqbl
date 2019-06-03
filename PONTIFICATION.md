## Pontification

Isolate DB reads and writes into services
The DB --> template boundary, and thus the Service --> View boundary should be entirely typed in structs
We should have one file collecting all of the db-coupled structs, and one file collecting all of the template-coupled structs.