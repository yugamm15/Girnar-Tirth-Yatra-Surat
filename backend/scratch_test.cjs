require('dotenv').config();
const { pool } = require('./config/db.js');

async function test() {
  try {
    console.log('Testing DB connection...');
    const [columns] = await pool.execute('DESCRIBE members');
    console.log('Members table columns:');
    columns.forEach(col => {
      console.log(` - ${col.Field}: ${col.Type} (Null: ${col.Null})`);
    });

    console.log('\nTrying dummy member update...');
    // Find a member first
    const [members] = await pool.execute('SELECT * FROM members LIMIT 1');
    if (members.length === 0) {
      console.log('No members found to update.');
      return;
    }
    const member = members[0];
    console.log(`Found member: id=${member.id}, name="${member.name}"`);

    // Let's simulate the update query that PUT route runs:
    // UPDATE members SET name = ? WHERE id = ?
    const fields = ['name = ?'];
    const params = ['test name', member.id];
    console.log('Executing:', `UPDATE members SET ${fields.join(', ')} WHERE id = ?`, params);
    const [result] = await pool.execute(
      `UPDATE members SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    console.log('Update result:', result);
  } catch (err) {
    console.error('❌ Error caught:', err);
  } finally {
    process.exit(0);
  }
}

test();
