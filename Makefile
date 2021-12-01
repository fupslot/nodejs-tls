CONFIG_DIR=$(HOME)/.nodejs-tls

.PHONY: init
init: 
	mkdir -p $(CONFIG_DIR)

.PHONY: certs
certs:
	cfssl gencert \
		-initca test/ca-csr.json | cfssljson -bare ca
	
	cfssl gencert \
		-ca=ca.pem \
		-ca-key=ca-key.pem \
		-config=test/ca-config.json \
		-profile=server \
		test/server-csr.json | cfssljson -bare server
	
	cfssl gencert \
		-ca=ca.pem \
		-ca-key=ca-key.pem \
		-config=test/ca-config.json \
		-profile=client \
		test/client-csr.json | cfssljson -bare client

	mv *.{pem,csr} /Users/eugene/.nodejs-tls