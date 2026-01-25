"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
// ✅ NUEVO: Importamos la acción del servidor
import { registrarDescarga } from "@/app/actions";

// 1. ESTILOS TIPO "Q1 JOURNAL"
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Times-Roman', fontSize: 10, lineHeight: 1.5 },
  header: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between', fontSize: 8, color: '#666', textTransform: 'uppercase' },
  title: { fontSize: 24, fontFamily: 'Times-Bold', marginBottom: 10, textAlign: 'center', color: '#000' },
  author: { fontSize: 12, textAlign: 'center', marginBottom: 20, fontFamily: 'Times-Roman', textTransform: 'uppercase' },
  abstractBox: { borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#999', paddingVertical: 10, marginBottom: 20, marginHorizontal: 20 },
  abstractTitle: { fontSize: 9, fontFamily: 'Times-Bold', marginBottom: 4 },
  abstractText: { fontSize: 9, fontStyle: 'italic', textAlign: 'justify' },
  body: { textAlign: 'justify', fontSize: 10 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#888', borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
});

// Función para limpiar HTML básico
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

// 2. EL DOCUMENTO PDF
const ArticleDocument = ({ post }: { post: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Cuadernos Abiertos de Investigación</Text>
        <Text>Vol. 1, No. 1 (2026)</Text>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>{post.author?.name || "Autor Institucional"}</Text>
      <View style={styles.abstractBox}>
        <Text style={styles.abstractTitle}>RESUMEN</Text>
        <Text style={styles.abstractText}>{post.excerpt || "Sin resumen disponible."}</Text>
      </View>
      <View style={styles.body}>
        <Text>{stripHtml(post.content)}</Text>
      </View>
      <Text style={styles.footer}>Editado en El Salvador • ISSN: En Trámite • {new Date().getFullYear()}</Text>
    </Page>
  </Document>
);

// 3. EL BOTÓN DE DESCARGA (CONECTADO AL CONTADOR)
export default function DownloadPDFButton({ post }: { post: any }) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="mt-2">
      <PDFDownloadLink
        document={<ArticleDocument post={post} />}
        fileName={`articulo-${post.slug}.pdf`}
        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition-colors shadow-sm"
      >
        {({ loading }) =>
          loading ? (
            'Generando PDF...'
          ) : (
            // ✅ NUEVO: Envolvemos en un span con onClick para registrar la descarga
            <span 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                    registrarDescarga(post.slug);
                }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Descargar PDF (Maquetado)
            </span>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}