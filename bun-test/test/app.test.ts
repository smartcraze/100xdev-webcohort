import {expect,test} from 'bun:test';

test('square from express', async() => { 
    const res = await fetch('http://localhost:3000/square/4');
    expect(res.status).toBe(200);
    const data:any = await res.json();
    
    expect(data.square).toBe(16);

    const resInvalid = await fetch('http://localhost:3000/square/invalid');
    expect(resInvalid.status).toBe(400);
    const errorData = await resInvalid.text();
    expect(errorData).toBe("Invalid number");
}
);
