export async function getFactusToken() {
  const url = `${import.meta.env.VITE_FACTUS_API_URL}/oauth/token`;
  
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: import.meta.env.VITE_FACTUS_CLIENT_ID,
    client_secret: import.meta.env.VITE_FACTUS_CLIENT_SECRET,
    username: import.meta.env.VITE_FACTUS_USERNAME,
    password: import.meta.env.VITE_FACTUS_PASSWORD,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Factus Token Error:", err);
    throw new Error('Error al obtener token de Factus');
  }

  const data = await response.json();
  return data.access_token;
}

export async function createFactusInvoice(token: string, customerData: any, material: any) {
  // La cuenta sandbox está configurada para v1, a pesar de que la documentación era v2.
  const url = `${import.meta.env.VITE_FACTUS_API_URL}/v1/bills/validate`;

  const price = 50000;
  
  const invoicePayload = {
    reference_code: `ANDES-${Date.now()}`,
    document: "01", 
    operation_type: "10",
    numbering_range_id: 8,
    observation: `Solicitud de material didáctico: ${material.name}`,
    payment_form: "1",
    payment_method_code: "10", // Efectivo/Consignacion en v1
    payment_due_date: "2026-12-31",
    customer: {
      identification_document_id: 3, // Cédula (v1)
      identification: customerData.idNumber,
      names: customerData.fullName,
      address: customerData.city,
      email: customerData.email,
      phone: customerData.phone,
      legal_organization_id: 2, // Natural (v1)
      tribute_id: 21,
      municipality_id: 980 // Bogotá en v1
    },
    items: [
      {
        code_reference: material.id,
        name: material.name,
        quantity: 1,
        discount_rate: 0,
        price: price,
        tax_rate: "19.00",
        unit_measure_id: 70, // Unidad en v1
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1, // IVA
        withholding_taxes: []
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(invoicePayload)
  });

  if (!response.ok) {
    const err = await response.json();
    console.error("Factus Invoice Error:", err);
    throw new Error('Error al crear la factura electrónica en Factus');
  }

  const data = await response.json();
  // El número de la factura suele venir en data.data.bill.number
  const invoiceNumber = data?.data?.bill?.number || 'DESCONOCIDO';
  return { ...data, success: true, simulated: false, number: invoiceNumber };
}

export async function downloadFactusPdf(token: string, number: string) {
  if (number.startsWith('SIMULADA')) {
    // Si la factura es simulada, no podemos descargarla del API, devolvemos null
    return null;
  }

  const url = `${import.meta.env.VITE_FACTUS_API_URL}/v1/bills/download-pdf/${number}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Factus PDF Download Error:", err);
    throw new Error('No se pudo descargar el PDF de la factura.');
  }

  const data = await response.json();
  // Devuelve la base64 string
  return data?.data?.pdf_base_64_encoded || data?.pdf_base_64_encoded || null;
}


